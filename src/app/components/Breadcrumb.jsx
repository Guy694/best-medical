import Link from "next/link";

const Breadcrumb = ({ items }) => (
  <nav className="text-gray-500 text-md md:text-lg py-2">
    {items.map((item, idx) => (
      <span key={idx}>
        {item.href ? (
          <Link href={item.href} className="hover:text-blue-700">
            {item.label}
          </Link>
        ) : (
          <span>{item.label}</span>
        )}
        {idx < items.length - 1 && " / "}
      </span>
    ))}
  </nav>
  
);

export default Breadcrumb;