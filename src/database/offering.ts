/** define offering interface */
export interface Offering {
  ID: number;
  name: string;
  description: string;
  price: number;
  category: string;
  //true = specials, false = regular (maybe use symbol)
  specialOffer: boolean;
}

/** make a mock list of coffee offerings */
export const OfferingList: Offering[] = [ // understand this

  // mock data for coffee offerings
{
  ID: 1,
  name: "Cappuccino",
  description: "A delicious cappuccino with steamed milk and foam",
  price: 5.90,
  category: "Coffee",
  specialOffer: false
},

{
  ID: 2,
  name: "Pumpkin Spice Latte",
  description: "A delicious pumpkin spice latte with steamed milk and foam",
  price: 6.2,
  category: "Coffee",
  specialOffer: true
},

{
  ID: 3,
  name: "Golden Hour Cold Brew",
  description: "A delicious cold brew with a golden hour twist",
  price: 6.5,
  category: "Coffee",
  specialOffer: true
},

{
  ID: 4,
  name: "Mocha",
  description: "A delicious mocha with steamed milk and chocolate",
  price: 5.99,
  category: "Coffee",
  specialOffer: false
},

{
  ID: 5,
  name: "Espresso",
  description: "A delicious espresso with rich and bold flavors",
  price: 5.0,
  category: "Coffee",
  specialOffer: false
},

{
  ID: 6,
  name: "Latte",
  description: "A drink made with espresso and a heave amount of steamed milk and topped with a light layer of foam",
  price: 5.5,
  category: "Coffee",
  specialOffer: false
},

{
  ID: 7,
  name: "Cortado",
  description: "A ratio of espresso and warm",
  price: 6.20,
  category: "Coffee",
  specialOffer: false
},

{
  ID: 8,
  name: "English Breakfast Tea",
  description: "A brewed black tea with a dash of milk",
  price: 4.5,
  category: "Coffee",
  specialOffer: false
},

{
  ID: 9,
  name: "Matcha",
  description: "Green tea with milk",
  price: 6.2,
  category: "Tea",
  specialOffer: false
},

{
  ID: 10,
  name: "Chia Latte",
  description: "Black tea combined with herbs and spieces with milk",
  price: 6.2,
  category: "Tea",
  specialOffer: false
},

{
  ID: 11,
  name: "Camomile Tea",
  description: "A tea made from camomile bush",
  price: 4.5,
  category: "Tea",
  specialOffer: false
},

{
  ID: 12,
  name: "Cafe au Lait",
  description: "A french press coffe with steamed milk",
  price: 6.20,
  category: "Coffee",
  specialOffer: false
},

{
  ID: 13,
  name: "London Fog",
  description: "Earl Grey tea with vanilla syrup with steamed milk",
  price: 5.0,
  category: "Iced",
  specialOffer: false
},

{
  ID: 14,
  name: "Iced Hibiscus Berry",
  description: "A caffeine-free herbal tea naturally sweetened and served over ice",
  price: 5.99,
  category: "Tea",
  specialOffer: false
},

{
  ID: 15,
  name: "Fruit Smoothie",
  description: "Real fruit puree blended with ice and yogurt",
  price: 5.99,
  category: "Smoothie",
  specialOffer: false
},

{
  ID: 16,
  name: "Hojicha Latte",
  description: "Roasted gree tea powder missed with steamed milk",
  price: 6.6,
  category: "Tea",
  specialOffer: true
},

]
