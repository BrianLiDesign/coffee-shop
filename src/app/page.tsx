import HomepagePrototype from "@/app/HomepagePrototype";

// Throwaway homepage exploration; kept on prototype/homepage until a direction wins.
export default function Home({ searchParams }: { searchParams: { variant?: string } }) {
  return <HomepagePrototype variant={searchParams.variant} />;
}
