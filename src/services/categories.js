import axios from "../config/axios"; 
const CategoryService = {
  getAll: () => axios.get("/categories").then((res) => res.data),
};

export default CategoryService;
