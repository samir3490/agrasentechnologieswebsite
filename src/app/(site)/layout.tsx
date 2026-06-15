import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import JsonLd from "@/components/JsonLd";
import { siteJsonLdGraph } from "@/lib/seo";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLd data={siteJsonLdGraph()} />
      <Navbar />
      {children}
      <Footer />
      <script
        type="text/javascript"
        id="hs-script-loader"
        async
        defer
        src="//js-na1.hs-scripts.com/7145941.js"
      />
    </>
  );
}
