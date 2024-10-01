import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function Result() {
  const router = useRouter();
  const { id } = router.query;
  const [result, setResult] = useState(null);

  useEffect(() => {
    if (id) {
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/responses/${id}`)
        .then((res) => res.json())
        .then((data) => setResult(data));
    }
  }, [id]);

  if (!result) return <div>Loading...</div>;

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Resultado del Test</h1>
        <pre>{JSON.stringify(result, null, 2)}</pre>
      </div>
    </div>
  );
}
