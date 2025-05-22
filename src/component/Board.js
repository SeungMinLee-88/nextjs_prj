import { 
  Button,
  Header,
  Container,
  ItemMeta,
  ItemImage,
  ItemHeader,
  ItemGroup,
  ItemExtra,
  ItemDescription,
  ItemContent,
  Image,
  Item, } from "semantic-ui-react";
/* import styles from "./Item.module.css"; */

export default function Board({ board }) {
/*   const {
    name,
    image_link,
    price,
    description,
    updated_at,
    category,
    product_type,
    product_link,
  } = item; */
  return (
    <>
      <ItemContent>
        <ItemHeader as='a'>{board.boardTitle}</ItemHeader>
        <ItemMeta>Description</ItemMeta>
        <ItemDescription>
          {/* <Image src='https://react.semantic-ui.com/images/wireframe/short-paragraph.png' /> */}
        </ItemDescription>
        <ItemExtra>Additional Details</ItemExtra>
      </ItemContent>
      <Container>
      <p>
      {board.boardContents}
        </p>
      </Container>
    </>
  );
}
/**
 * 
 * 
 * api_featured_image: "//s3.amazonaws.com/donovanbailey/products/api_featured_images/000/000/452/original/open-uri20171223-4-1pmofky?1514062277"
brand: "maybelline"
category: "powder"
created_at: "2016-10-01T18:35:07.476Z"
currency: null
description: "Maybelline Face Studio Master Hi-Light Light Boosting blush formula has an expert ↵balance of shade + shimmer illuminator for natural glow. Skin goes ↵soft-lit with zero glitz.↵↵		For Best Results: Brush over all shades in palette and gently sweep over ↵cheekbones, brow bones, and temples, or anywhere light naturally touches↵ the face.↵↵		↵	↵↵                    "
id: 452
image_link: "https://d3t32hsnjxo7q6.cloudfront.net/i/e8c59b78ebeaec5c4b6aeba49a9ff0f6_ra,w158,h184_pa,w158,h184.png"
name: "Maybelline Face Studio Master Hi-Light Light Booster Blush "
price: "14.99"
price_sign: null
product_api_url: "http://makeup-api.herokuapp.com/api/v1/products/452.json"
product_colors: []
product_link: "https://well.ca/products/maybelline-face-studio-master_88836.html"
product_type: "blush"
rating: 5
tag_list: []
updated_at: "2017-12-23T20:51:17.460Z"
website_link: "https://well.ca"
 * 
 * 
 */