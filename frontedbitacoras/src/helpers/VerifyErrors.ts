export const verifyError=(error:unknown):string=>{
    return error instanceof Error ? error.message : "Ocurrio un error inesperado";
}