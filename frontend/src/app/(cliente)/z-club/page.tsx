import ZClubView from "@/components/client-info/Z-Club";

export default function ZClubPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="text-4xl font-bold mb-4">Bienvenido al Z-Club</h1>
      <p className="text-lg text-gray-700 bg-center bg-no-repeat bg-cover p-4 rounded-md shadow-md">
        Aquí encontrarás contenido exclusivo y beneficios especiales para nuestros miembros.
        <ZClubView/>
      </p>
      {/* Agrega más contenido o componentes según sea necesario */}
    </div>
  );
}