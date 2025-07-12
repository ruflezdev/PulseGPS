export type UsuarioGPS = {
  latitud: number;
  longitud: number;
  bateria: number;
  timestamp: number;
};

export type UsuariosData = Record<string, UsuarioGPS>;
