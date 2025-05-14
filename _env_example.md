# Configuración de la base de datos de supabase

En supabase no se puede crear un backup ni descargar la base de datos sin tener que pagar la cuenta pro de la plataforma,
por lo cual mejor opté por invitarlo mediante su correo a mi organización de supabase para que desde ahí pueda ver la base de datos
y así poder iniciar el proyecto.

La conexión a la base de datos está en la carpeta **src/app/lib/supabaseClient.ts**
Ahí viene el import de supabase la URL y la ANON KEY, cuando usted se una a la organización la URL y la ANON KEY
serán las mismas, sino lo unico que tiene que hacer es al momento de ya entrar a mi organización y estar en el proyecto,
tiene que dirigirse al panel de la izquierda, darle click a **Proyect Settings** despues irse al apartado de **Configurarion**
y darle click a **Data API** y en ese apartado dice la URL y la ANON KEY y solamente es reemplazarlo en el archivo de
**supabaseClient.ts**, si al momento de revisar el correo de invitación a la organización ya no funciona el link, con gusto mandeme
un correo y se lo vuelvo a mandar, una disculpa por la inconveniencia, pero así es la plataforma de supabase y no encontré
otra solución, de nuevo una disculpa por la inconveniencia.

#### Mi correo es za210111009@zapopan.tecmm.edu.mx y la invitación se la mandé al correo leon.ramos@zapopan.tecmm.edu.mx
