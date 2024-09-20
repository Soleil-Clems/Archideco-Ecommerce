import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination, Autoplay } from "swiper/modules";

export default function Carousel({ type }: { type: "marques" | "items" }) {
  const items = [
    {
      title: "Machine à café Nespresso",
      src: "./src/assets/cafe/cafe1.png",
    },
    {
      title: "Blender LG",
      src: "./src/assets/cafe/cafe2.png",
    },
    {
      title: "Robot Moulinex",
      src: "./src/assets/mixeur/mixeur1.png",
    },
    {
      title: "Machine à café Nespresso",
      src: "./src/assets/cafe/cafe1.png",
    },
    {
      title: "Blender LG",
      src: "./src/assets/cafe/cafe2.png",
    },
    {
      title: "Robot Moulinex",
      src: "./src/assets/mixeur/mixeur1.png",
    },
    {
      title: "Machine à café Nespresso",
      src: "./src/assets/cafe/cafe1.png",
    },
    {
      title: "Blender LG",
      src: "./src/assets/cafe/cafe2.png",
    },
    {
      title: "Robot Moulinex",
      src: "./src/assets/mixeur/mixeur1.png",
    },
  ];

  const marques = [
    {
      src: "./src/assets/marques/Asus.png",
    },
    {
      src: "./src/assets/marques/candy.png",
    },
    {
      src: "./src/assets/marques/delonghi.png",
    },
    {
      src: "./src/assets/marques/dyson.png",
    },
    {
      src: "./src/assets/marques/electrolux.png",
    },

    {
      src: "./src/assets/marques/philips.png",
    },
    {
      src: "./src/assets/marques/rowenta.png",
    },
    {
      src: "./src/assets/marques/samsung.png",
    },
    {
      src: "./src/assets/marques/smeg.png",
    },
    {
      src: "./src/assets/marques/thomson.png",
    },
    {
      src: "./src/assets/marques/whirlpool.png",
    },
  ];

  const data = type === "marques" ? marques : items;

  return (
    <Swiper
      slidesPerView={type === "marques" ? 8 : 4}
      spaceBetween={40}
      pagination={{
        clickable: true,
      }}
      modules={[Pagination]}
      className="mySwiper"
    >
      {data.map((item, key) => (
        <SwiperSlide key={key}>
          <div className="flex flex-col justify-center items-center min-h-32 h-auto w-auto py-6">
            <img
              src={item.src}
              alt={item.title || `Marque ${key}`}
              className="h-40 w-40 object-contain"
              height={type === "marques" ? 40 : "auto"}
              width={type === "marques" ? 40 : "auto"}
            />
            {type === "items" && (
              <h3 className="font-Gotham text-xs md:text-lg text-center mt-2">
                {item.title}
              </h3>
            )}
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
