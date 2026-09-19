// app/admin/cupones/page.tsx
//Agrego para subir al server:
//"use client"; /
"use client";
import FormCupon from "@/components/admin/Form-Coupon";


export default function CuponesPage() {
  return (
    <div className="p-4">
      <FormCupon onSuccess={function (): void {
        throw new Error("Function not implemented.");
      } } />
    </div>
  );
}
