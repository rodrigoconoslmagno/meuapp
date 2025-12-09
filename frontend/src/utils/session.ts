const Session = {
    isLoggedIn(): boolean {
      return sessionStorage.getItem("usuario") !== null;
    },
  
    saveUser(usuario: string) {
      sessionStorage.setItem("usuario", usuario);
    },
  
    logout() {
      sessionStorage.removeItem("usuario");
    },
  
    getUser() {
      const u = sessionStorage.getItem("usuario");
      return u ? u : null;
    },

    getLoggedUser() {
      try {
        const data = sessionStorage.getItem("usuario");
        return data ? data : null;
      } catch {
        return null;
      }
    },

    setMsgError(msg: string){
      sessionStorage.setItem("msgerror", msg)
    },

    getMsgError(){
      return sessionStorage.getItem("msgerror")
    },

    removerMsgError(){
      sessionStorage.removeItem("msgerror")
    }
  };
  
  export default Session;