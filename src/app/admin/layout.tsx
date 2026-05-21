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
