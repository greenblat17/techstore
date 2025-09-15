import { NotFoundDisplay } from "@/components/error/error-display";

export default function ProductNotFound() {
  return (
    <div className="container py-16">
      <NotFoundDisplay
        title="Product Not Found"
        message="The product you're looking for doesn't exist or has been removed from our catalog."
        showHome={true}
        showBack={true}
      />
    </div>
  );
}