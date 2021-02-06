import Link from 'next/link';

export default function Nav() {
  return (
    <nav>
      <Link href="product">product</Link>
      <Link href="sell">sell</Link>
      <Link href="orders">orders</Link>
      <Link href="account">account</Link>
    </nav>
  );
}
