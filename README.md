# Practicas_Arquitectura_Progra
Repositorio con las practicas de la asignatura Arquitectura y Programación de Sistemas en Internet

Endpoints practica 3:
  .post("/cliente", CrearCliente) -> Crea un cliente, el body necesita "nombre", "dni", "correo" y "telefono", opcional mente se puede añadir "dineroCuenta" si se quiere iniciar el cliente con x dinero.
  
  .post("/hipoteca", CrearHipoteca) ->  Crea una hipoteca, el body necesita "total" (costo total de la hipoteca) y "idCliente", no tiene idGestor porque lo he querido hacer sin redundancias, por lo que comprueba directamente en el cliente si tiene gestor o no.
  
  .post("/gestor", CrearGestor) -> Crea un gestor, el body necesita "nombre" y "dni", que conste que una misma persona puede ser gestor y cliente a la vez.
  
  .delete("/cliente/:id", BorrarCliente) -> Elimina un cliente, se pasa el id del cliente y si este no tiene hipotecas por pagar se elimina
  
  .put("/cliente/:idSender/:idReceiver/:cantidadEnviada", EnviarDinero) -> Envia dinero de un cliente a otro, en la url especificamos el Sender(emisor), Receiver(receptor) y la cantidad a enviar
  
  .put("/cliente/:id/:cantidadIngresada", IngresarDinero) -> Ingresa dinero a un cliente, en la url especificamos que cliente y cuanto le ingresamos
  
  .put("/asignar/:idGestor/:idCliente", AsignarGestor) -> Asigna un gestor a un cliente, le pasamos primero el id del gestor y luego la del cliente, no al reves.
  
  .put("/hipoteca/:idHipoteca", AmortizarHipoteca) -> Se realiza el pago de una de las cuotas de la hipoteca que especificamos mediante su id en la url
  
  .get("/cliente", GetAllClientes) -> Muestra todos los clientes, pero solo los datos suficientes para poder identificarlos (id, nombre, dinero y gestor)
  
  .get("/cliente/:id", GetCliente) -> Muestra todos los datos de un cliente, aqui ya se incluye el correo, telefono y dni del cliente
  
  .get("/gestor", GetAllGestores) -> Muestra todos los gestores, mostrando de cada uno su nombre, id y numero de clientes
  
  .get("/gestor/:id", GetGestor) -> Muestra los datos sobre un gestor y los id de sus clientes, en vez de solo mostrar cuantos tiene
  
  .get("/hipoteca", GetAllHipotecas) -> Muestra de todas las hipotecas su id, total restante a pagar, cuotas restantes y cliente a quien pertenece
  
  .get("/movimientos/:idCliente", GetMovimientos) -> Muestra todos los movimientos bancarios de un cliente que le especificamos, mostrará dos array, uno con los movimientos de envio de dinero (Envios a otro cliente o pagos de cuotas) y uno con los movimientos donde recibe dinero (Que le envie dinero otro cliente o que reciba un ingreso). Sobre los movimientos se muestra id, emisor, receptor, cantidad, detalles sobre la transaccion y fecha de la misma
