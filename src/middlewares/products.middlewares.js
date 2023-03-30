export const addProductMid = (req, res, next) => {
    res.setHeader("Content-Type", "application/json");
    let { title, description, code, price, status, stock, category } = req.body;
    let emptyField = !(title && description && code && price && stock && category);
    if (emptyField) {
      return res.status(400).json({ error: "Product not added. Error: must complete all required fields" });
    }
    req.body.price = Number(price);
    req.body.stock = Number(stock);
    let invalidStatus = !["false", "true", "", undefined].includes(status);
    console.log(invalidStatus);
    if (isNaN(req.body.price) || isNaN(req.body.stock) || invalidStatus) {
      return res.status(400).json({ error: "Product not added. Invalid value(s)" });
    }
    status === "false" ? (req.body.status = false) : (req.body.status = true);
    next();
  };
  
  export const updateProductMid = (req, res, next) => {
    res.setHeader("Content-Type", "application/json");
    let { title, description, code, price, status, stock, category, thumbnails } = req.body;
  
    if (title || title === "") {
      let regex = /.+/;
      if (!regex.test(title)) {
        return res.status(400).json({ error: "Product not added. Invalid title value" });
      }
    }
    
    if (description || description === "") {
      let regex = /(.|\s)+/;
      if (!regex.test(description)) {
        return res.status(400).json({ error: "Product not added. Invalid description value" });
      }
    }
  
    if (code || code === "") {
      let regex = /.+/;
      if (!regex.test(code)) {
        return res.status(400).json({ error: "Product not added. Invalid code value" });
      }
    }
  
    if (price || price === "") {
      let regex = /^\d+\.?\d{0,2}$/;
      if (regex.test(price)) {
        req.body.price = Number(price);
      } else {
        return res.status(400).json({ error: "Product not added. Invalid price value" });
      }
    }
  
    if (status || status === "") {
      let validStatus = ["false", "true"].includes(status);
      if (validStatus) {
        status === "false" ? (req.body.status = false) : (req.body.status = true);
      } else {
        return res.status(400).json({ error: "Product not added. Invalid status value" });
      }
    }
  
    if (stock || stock === "") {
      let regex = /^\d+$/;
      if (regex.test(stock)) {
        req.body.stock = Number(stock);
      } else {
        return res.status(400).json({ error: "Product not added. Invalid stock value" });
      }
    }
  
    if (category || category === "") {
      let regex = /.+/;
      if (!regex.test(category)) {
        return res.status(400).json({ error: "Product not added. Invalid category value" });
      }
    }
  
    if (img) {
      img.forEach(el => { 
        let regex = /^[\w\.\_\-\/\\]+$/;
        if (!regex.test(el)) {
          return res.status(400).json({ error: "Product not added. Invalid thumbnail value" });
        }
      });
    }
  
    next();
  };