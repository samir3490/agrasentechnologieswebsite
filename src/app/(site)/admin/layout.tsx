import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin | Agrasen Technologies",
  robots: { index: false, follow: false },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: `
            body > nav, body > footer, body > #hs-script-loader { display: none !important; }
          `,
        }}
      />
      {children}
    </>
  );
}
