import { type Shop, type ShopType } from "@prisma/client";
import { db } from "../src/server/db";

const addresses = [
  "ul. Kwiatowa 15, Warszawa",
  "ul. Słoneczna 8, Kraków",
  "ul. Główna 22, Gdańsk",
  "ul. Parkowa 5, Poznań",
  "ul. Mickiewicza 12, Wrocław",
  "ul. Długa 33, Łódź",
  "ul. Kościuszki 7, Katowice",
  "ul. Warszawska 45, Lublin",
  "ul. Krakowska 18, Białystok",
  "ul. Gdańska 27, Szczecin",
  "ul. Poznańska 9, Bydgoszcz",
  "ul. Wrocławska 14, Opole",
  "ul. Łódzka 23, Kielce",
  "ul. Katowicka 31, Rzeszów",
  "ul. Lubelska 42, Olsztyn",
  "ul. Białostocka 6, Zielona Góra",
  "ul. Szczecińska 19, Gorzów Wielkopolski",
  "ul. Bydgoska 25, Toruń",
  "ul. Opolska 11, Radom",
  "ul. Kielecka 37, Sosnowiec",
];

interface DogApiResponse {
  message: string[];
  status: string;
}

const FALLBACK_IMAGE = "https://http.cat/status/404.jpg";

const getImages = async (): Promise<string[]> => {
  const response = await fetch(
    `https://dog.ceo/api/breed/corgi/cardigan/images/random/${addresses.length}`,
  );
  const data = (await response.json()) as DogApiResponse;
  return data.message;
};

async function main() {
  const images = await getImages();

  const shops: Omit<Shop, "id">[] = addresses.map((address, index) => ({
    address,
    imageUrl: images[index] ?? FALLBACK_IMAGE,
    type: Math.random() > 0.5 ? "FRANCHISE" : ("REGULAR" as ShopType),
  }));

  await db.shop.createMany({
    data: shops,
  });

  console.log("Baza zafaszerowana");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => {
    void db.$disconnect();
  });
