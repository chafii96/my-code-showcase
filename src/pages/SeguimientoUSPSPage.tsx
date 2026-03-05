import Layout from "@/components/Layout";
import SEOHead from "@/components/SEOHead";
import { Link } from "react-router-dom";
import { Search, ArrowRight, Package, Globe, Truck, Clock, Shield, MapPin } from "lucide-react";
import InternalLinkingHub from "@/components/InternalLinkingHub";
import { AdSlot } from "@/components/ads/AdSlot";

const SeguimientoUSPSPage = () => {
  // ❌ FAQPage schema removed - not eligible for commercial sites (Google policy Aug 2023)

  return (
    <Layout>
      <SEOHead
        title="Seguimiento USPS – Rastrear Paquete USPS en Tiempo Real"
        description="Seguimiento USPS gratis. Rastrear paquete USPS con número de seguimiento. Actualizaciones en tiempo real del estado de entrega. Seguimiento de paquetes del Servicio Postal de Estados Unidos."
        canonical="/seguimiento-usps"
        keywords="seguimiento usps, seguimiento de usps, rastrear paquete usps, usps seguimiento, rastreo usps, seguimiento de paquete usps, usps rastreo, rastrear envio usps, usps en español, correo postal estados unidos seguimiento"
        structuredData={faqSchema}
      />

      <section className="bg-gradient-to-br from-primary via-primary/90 to-primary/80 text-primary-foreground py-16">
        <div className="container max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 bg-accent/10 border border-accent/20 rounded-full px-4 py-2 mb-6">
            <Globe className="h-4 w-4 text-accent" />
            <span className="text-xs font-semibold text-accent uppercase tracking-wide">Seguimiento Gratuito</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-4 tracking-tight">
            Seguimiento USPS
          </h1>
          <p className="text-lg text-primary-foreground/70 max-w-2xl mx-auto mb-8">
            Rastrear paquete USPS gratis y en tiempo real. Ingrese su número de seguimiento para ver el estado de entrega de su paquete del Servicio Postal de Estados Unidos.
          </p>
          <Link to="/" className="inline-flex items-center gap-2 bg-accent text-accent-foreground px-8 py-4 rounded-xl font-bold text-lg hover:bg-accent/90 transition-colors">
            <Search className="h-5 w-5" /> Rastrear Paquete Ahora <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>

      <section className="container max-w-4xl py-12">
        <h2 className="text-2xl font-bold text-foreground mb-4">¿Cómo Funciona el Seguimiento USPS?</h2>
        <div className="prose prose-sm max-w-none text-muted-foreground space-y-4 leading-relaxed">
          <p>
            El <strong>seguimiento USPS</strong> (también conocido como <strong>USPS tracking</strong> en inglés) es un servicio gratuito del Servicio Postal de los Estados Unidos que le permite monitorear la ubicación y el estado de sus paquetes y correo en tiempo real. Al enviar un paquete a través de USPS, recibirá un número de seguimiento único que puede usar para <strong>rastrear paquete USPS</strong> en cualquier momento.
          </p>
          <p>
            Nuestra herramienta de <strong>seguimiento de USPS</strong> se conecta directamente al sistema de rastreo de USPS para proporcionarle actualizaciones instantáneas del estado de entrega. Ya sea que esté buscando <strong>seguimiento de paquete USPS</strong>, <strong>rastreo USPS</strong>, o <strong>USPS en español</strong>, aquí encontrará todo lo que necesita.
          </p>
          <p>
            El Servicio Postal de los Estados Unidos (USPS) es el sistema postal más grande del mundo, procesando más de <strong>7.3 mil millones de piezas de correo</strong> anualmente a través de más de 31,000 oficinas postales. Nuestra herramienta de <strong>seguimiento USPS</strong> le da acceso a los mismos datos de rastreo en tiempo real utilizados por los empleados de USPS en todo el país, completamente gratis.
          </p>
        </div>
      </section>

      <section className="bg-muted py-12">
        <div className="container max-w-4xl">
          <h2 className="text-2xl font-bold text-foreground mb-6">Servicios de Seguimiento USPS</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { icon: Truck, title: "Priority Mail (Correo Prioritario)", desc: "Entrega en 1-3 días con seguimiento completo y seguro de $100. Los números de seguimiento comienzan con 9400 o 9205.", link: "/track-usps" },
              { icon: Package, title: "First-Class (Primera Clase)", desc: "Entrega en 1-5 días para paquetes hasta 13 oz. Los números de seguimiento comienzan con 9400. Seguimiento completo incluido.", link: "/postal-tracking" },
              { icon: Shield, title: "Certified Mail (Correo Certificado)", desc: "Prueba de envío y entrega con firma. Los números comienzan con 9407. Ideal para documentos legales e importantes.", link: "/mail-tracking" },
              { icon: Globe, title: "Internacional", desc: "Rastrear paquetes internacionales con números de 13 caracteres (ej: EA123456789US). Cobertura en más de 190 países.", link: "/usa-tracking" },
            ].map((s) => (
              <Link key={s.title} to={s.link} className="bg-card border rounded-xl p-5 hover:border-primary/30 transition-all group">
                <s.icon className="h-5 w-5 text-primary mb-2" />
                <h3 className="font-bold text-foreground group-hover:text-primary transition-colors">{s.title}</h3>
                <p className="text-sm text-muted-foreground mt-1">{s.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="container max-w-4xl py-12">
        <h2 className="text-2xl font-bold text-foreground mb-4">Preguntas Frecuentes sobre Seguimiento USPS</h2>
        <div className="space-y-6">
          {[
            { q: "¿Cómo rastrear un paquete USPS?", a: "Ingrese su número de seguimiento USPS (20-22 dígitos para envíos domésticos, o 13 caracteres para internacionales) en nuestro buscador gratuito. Obtendrá actualizaciones en tiempo real con la ubicación exacta y el estado de su paquete." },
            { q: "¿Cuánto tarda el seguimiento en actualizarse?", a: "Las actualizaciones de seguimiento USPS generalmente aparecen dentro de 24 horas después de cada escaneo. Durante períodos de alto volumen (temporada navideña, días festivos), las actualizaciones pueden tardar hasta 48-72 horas." },
            { q: "¿Puedo rastrear sin número de seguimiento?", a: "Sí. Puede usar USPS Informed Delivery, un servicio gratuito que detecta automáticamente los paquetes entrantes a su dirección. También puede contactar al remitente para obtener el número de seguimiento." },
            { q: "¿El seguimiento USPS funciona para paquetes internacionales?", a: "Sí. Los paquetes internacionales con números que terminan en 'US' (como EA123456789US) se pueden rastrear a través de nuestro sistema. La cobertura de seguimiento internacional puede variar según el país de origen." },
          ].map((item, i) => (
            <div key={i} className="border rounded-xl p-5 bg-card">
              <h3 className="font-bold text-foreground mb-2">{item.q}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{item.a}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-muted py-12">
        <div className="container max-w-4xl">
          <h2 className="text-2xl font-bold text-foreground mb-4">También disponible en inglés</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {[
              { label: "USPS Tracking", to: "/" },
              { label: "Track USPS", to: "/track-usps" },
              { label: "Postal Tracking", to: "/postal-tracking" },
              { label: "Mail Tracking", to: "/mail-tracking" },
              { label: "USA Tracking", to: "/usa-tracking" },
              { label: "Where Is My Package", to: "/where-is-my-package" },
            ].map((link) => (
              <Link key={link.to} to={link.to} className="text-sm text-primary hover:underline bg-card border rounded-lg p-3 text-center">
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <div className="container py-3 flex justify-center"><AdSlot slotId="content-ad" /></div>
      <InternalLinkingHub />
    </Layout>
  );
};

export default SeguimientoUSPSPage;
