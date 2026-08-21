import Header from "@/components/Header";
import Hero from "@/components/Hero";
import LogoBar from "@/components/LogoBar";
import Cases from "@/components/Cases";
import Process from "@/components/Process";
import Features from "@/components/Features";
import PhoneScrollRotation from "@/components/PhoneScrollRotation";
import Faq from "@/components/Faq";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <LogoBar />
        <Cases />
        <Process />
        <Features />
        <PhoneScrollRotation />
        <Faq />
      </main>
      <Footer />
    </>
  );
}
