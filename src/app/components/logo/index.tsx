import logo from "../../favicon.ico";
import Image from "next/image";
import Link from "next/link";

export default function Logo() {
  return (
    <Link href="/">
      <Image src={logo} alt="Logo" width={100} height={50} />
    </Link>
  );
}