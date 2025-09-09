import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { inr, productImageUrl } from "@/lib/utils";
import { useCart } from "@/lib/cart";
import { MOCK_PRODUCTS } from "@/lib/mockData";

export default function Product() {
  const { slug } = useParams();
  const cart = useCart();

  const { data } = useQuery({
    queryKey: ["product", slug],
    queryFn: async () => {
      try {
        const { data, error } = await (supabase as any)
          .from("products")
          .select("id,name,slug,description,price_inr,discount_percent,category_id")
          .eq("slug", slug)
          .maybeSingle();
        if (error) throw error;
        if (!data) throw new Error("not found");
        return data;
      } catch {
        const local = MOCK_PRODUCTS.find((p) => p.slug === slug);
        if (!local) throw new Error("not found");
        return local;
      }
    },
  });

  const product = data as any;
  if (!product) return null;
  const finalPrice = Math.round(product.price_inr * (1 - product.discount_percent / 100));

  const { data: related } = useQuery({
    queryKey: ["related", product.category_id],
    queryFn: async () => {
      try {
        const { data, error } = await (supabase as any)
          .from("products")
          .select("id,name,slug,price_inr,discount_percent,category_id")
          .eq("category_id", product.category_id)
          .neq("id", product.id)
          .limit(4);
        if (error) throw error;
        return data ?? [];
      } catch {
        return MOCK_PRODUCTS.filter((p) => p.category_id === product.category_id && p.id !== product.id).slice(0, 4);
      }
    },
  });

  return (
    <div className="container mx-auto px-4 py-10">
      <Helmet>
        <title>{product.name} — SnapTechFix</title>
        <link rel="canonical" href={`/p/${product.slug}`} />
      </Helmet>
      <div className="grid lg:grid-cols-2 gap-8">
        <div>
          <Card className="overflow-hidden">
            <CardContent className="p-0">
              <img src={productImageUrl(product)} className="w-full aspect-square object-cover" alt={`Product image of ${product.name}`} width={400} height={400} loading="lazy" decoding="async" />
            </CardContent>
          </Card>
        </div>
        <div>
          <h1 className="text-2xl font-bold">{product.name}</h1>
          {product.brand && <div className="text-sm text-muted-foreground mt-0.5">{product.brand}</div>}
          <div className="mt-2 flex items-center gap-2">
            {product.best_seller && (
              <span className="rounded bg-amber-500 text-white text-xs px-2 py-1">Best Seller</span>
            )}
            {typeof product.warranty_months === 'number' && product.warranty_months > 0 && (
              <span className="rounded bg-black/5 text-xs px-2 py-1">Warranty: {product.warranty_months} months</span>
            )}
          </div>
          {product.description && <p className="text-muted-foreground mt-2">{product.description}</p>}
          <div className="mt-4 flex items-center gap-2">
            <span className="text-xl font-semibold">{inr(finalPrice)}</span>
            {product.discount_percent > 0 && (
              <span className="text-sm text-muted-foreground line-through">{inr(product.price_inr)}</span>
            )}
          </div>
          {Array.isArray((product as any).specs) && (product as any).specs.length > 0 && (
            <ul className="mt-4 list-disc pl-5 text-sm space-y-1 text-muted-foreground">
              {(product as any).specs.map((s: string, idx: number) => (
                <li key={idx}>{s}</li>
              ))}
            </ul>
          )}
          <div className="mt-6 flex gap-3">
            <Button onClick={() => cart.add({ id: product.id, name: product.name, unitPrice: finalPrice }, 1)}>Add to Cart</Button>
            <Button variant="secondary" asChild><Link to="/checkout">Buy Now</Link></Button>
          </div>
        </div>
      </div>

      <section className="mt-10">
        <h2 className="text-xl font-semibold mb-3">Related Products</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {(related ?? []).map((r: any) => (
            <Card key={r.id} className="hover-scale">
              <CardContent className="p-4">
                <Link to={`/p/${r.slug}`} className="font-medium hover:underline">{r.name}</Link>
                <div className="text-sm text-muted-foreground">{inr(Math.round(r.price_inr * (1 - r.discount_percent / 100)))}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}


