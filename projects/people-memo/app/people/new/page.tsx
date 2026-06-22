import Link from "next/link";
import PersonForm from "@/components/PersonForm";

export default function NewPersonPage() {
  return (
    <div className="space-y-4">
      <Link
        href="/"
        className="tap-target inline-flex items-center text-sm text-(--subtext)"
      >
        ← 戻る
      </Link>
      <h1 className="text-xl font-semibold">新しく追加</h1>
      <PersonForm />
    </div>
  );
}
