import Image from "next/image";

export default function BrandLogo() {
  return (
    <span className="logo">
      <Image src="/logo.svg" alt="Seyora" fill sizes="42px" style={{ objectFit: "contain" }} />
    </span>
  );
}
