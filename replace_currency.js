const fs = require('fs');
const path = require('path');

const filesToUpdate = [
  'frontend/src/pages/AdminProducts.jsx',
  'frontend/src/pages/Cart.jsx',
  'frontend/src/pages/Checkout.jsx',
  'frontend/src/pages/OrderDetails.jsx',
  'frontend/src/pages/Orders.jsx',
  'frontend/src/pages/ProductDetails.jsx',
  'frontend/src/pages/Shop.jsx',
  'frontend/src/pages/Wishlist.jsx'
];

filesToUpdate.forEach(file => {
  const fullPath = path.join(__dirname, file);
  if (!fs.existsSync(fullPath)) return;
  
  let content = fs.readFileSync(fullPath, 'utf8');
  
  // Replace >${ with >₹{
  content = content.replace(/>\$\{/g, '>₹{');
  
  // Replace >$ with >₹
  content = content.replace(/>\$/g, '>₹');
  
  // What about template literals that are not tags? e.g. -${
  content = content.replace(/-\$\{/g, '-₹{');
  
  fs.writeFileSync(fullPath, content);
});

console.log('Currency replaced');

