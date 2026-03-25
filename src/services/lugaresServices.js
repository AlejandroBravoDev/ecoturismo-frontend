import api from "./api";

export const getLugares = (params) => {
  return api.get("/lugares", { params });
};

export const getMunicipios = () => {
  return api.get("/municipios");
};

export const deleteLugar = (id) => {
  return api.delete(`/lugares/${id}`);
};
