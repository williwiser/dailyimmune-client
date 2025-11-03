import Header from "@/layouts/Header";

const NotFound = () => {
  return (
    <div>
      <Header
        title="404 - Not found."
        desc="It seems the page you are looking for doesn't exist"
        className="bg-stone-100"
      />
    </div>
  );
};

export default NotFound;
