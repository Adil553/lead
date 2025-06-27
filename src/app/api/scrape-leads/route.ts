/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import * as cheerio from "cheerio";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { make, model, priceMin, priceMax, city, ccMin, ccMax } =
    await req.json();

  try {
    const queryMake = make?.toLowerCase().replace(/\s+/g, "-") || "";
    const searchText = [make].filter(Boolean).join("+");

    const searchUrl = `https://www.pakwheels.com/used-cars/search/-/mk_${queryMake}/ct_${city?.toLowerCase()}/pr_${priceMin}_${priceMax}/ec_${ccMin}_${ccMax}/yr_earlier_${model}/?q=${searchText}`;
    console.log("Search URL:", searchUrl);

    const response = await axios.get(searchUrl);
    const $ = cheerio.load(response.data);
    const listings: any[] = [];

    const liElements = $("li.classified-listing").toArray();

    // Loop with async/await to make seller contact API calls
    for (const el of liElements) {
      const $el = $(el);
      const scriptContent = $el
        .find("script[type='application/ld+json']")
        .html();

      let jsonData: any = {};
      try {
        if (scriptContent) {
          jsonData = JSON.parse(scriptContent);
        }
      } catch (e) {
        console.warn("Failed to parse JSON-LD script:", e);
      }

      const title = $el.find(".search-title a").text().trim();
      const price = $el.find(".price-details").text().trim();
      const location = $el.find(".listing-location").text().trim();
      const link =
        "https://www.pakwheels.com" + $el.find(".car-title a").attr("href");
      const isShowroom = $el
        .find(".make-model strong")
        .text()
        .toLowerCase()
        .includes("motors");

      // Extract ID from offers.url
      let postId = "";
      const offersUrl = jsonData?.offers?.url || "";
      const match = offersUrl.match(/-(\d+)$/); // Match number at end
      if (match) postId = match[1];

      let seller_contact = null;
      if (postId) {
        try {
          console.log(
            `https://www.pakwheels.com/used-cars/${postId}/seller_contact_info`
          );
          const contactRes = await axios.get(
            `https://www.pakwheels.com/used-cars/${postId}/seller_contact_info`,
            {
              headers: {
                "User-Agent":
                  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/114 Safari/537.36",
              },
            }
          );
          console.log(contactRes, "contactRes.................");
          seller_contact = contactRes.data;
        } catch (err) {
          console.warn(`Failed to fetch contact info for ID ${postId}`, err);
        }
      }

      listings.push({
        title,
        price,
        phone: "N/A",
        email: "N/A",
        location,
        isShowroom,
        link,
        ...jsonData,
        seller_contact,
      });
    }

    return NextResponse.json({ items: listings });
  } catch (error) {
    console.error("Scraper error:", error);
    return NextResponse.json(
      { error: "Failed to generate user leads." },
      { status: 500 }
    );
  }
}
