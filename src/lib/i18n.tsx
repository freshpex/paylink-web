import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { Globe2, Check } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

export type Locale = "en" | "es" | "ar";

export const locales: Record<Locale, { name: string; country: string; dir: "ltr" | "rtl" }> = {
  en: { name: "English", country: "gb", dir: "ltr" },
  es: { name: "Español", country: "es", dir: "ltr" },
  ar: { name: "العربية", country: "sa", dir: "rtl" },
};

const translations: Record<Locale, Record<string, string>> = {
  en: {},
  es: {
    "Language": "Idioma", "English": "Inglés", "Español": "Español", "العربية": "Árabe",
    "Opening your workspace…": "Abriendo tu espacio de trabajo…", "Loading receipt…": "Cargando recibo…",
    "Page not found": "Página no encontrada", "Go to workspace": "Ir al espacio de trabajo",
    "A MORE PERSONAL WAY TO GET PAID": "UNA FORMA MÁS PERSONAL DE COBRAR", "A BRAND THEY RECOGNIZE": "UNA MARCA QUE RECONOCEN",
    "Your business.": "Tu negocio.", "Your brand.": "Tu marca.", "Your payment link.": "Tu enlace de pago.",
    "Turn a simple request into a thoughtful payment experience. From the first link to the final receipt.": "Convierte una simple solicitud en una experiencia de pago cuidada. Desde el primer enlace hasta el recibo final.",
    "Every company, one workspace": "Todas tus empresas, un espacio de trabajo", "Beautiful, branded receipts": "Recibos bonitos y personalizados",
    "Made for the way you do business.": "Hecho para tu forma de hacer negocios.", "LET’S MAKE IT OFFICIAL": "HAGÁMOSLO OFICIAL",
    "Create your workspace": "Crea tu espacio de trabajo", "Welcome back.": "Bienvenido de nuevo.",
    "A better payment experience starts here.": "Una mejor experiencia de pago empieza aquí.",
    "Your companies and payment links are right here.": "Tus empresas y enlaces de pago están aquí.",
    "Your name": "Tu nombre", "Company name": "Nombre de la empresa", "Email address": "Correo electrónico",
    "Password": "Contraseña", "Use at least 12 characters.": "Usa al menos 12 caracteres.",
    "Create workspace": "Crear espacio de trabajo", "Sign in": "Iniciar sesión", "Already have a workspace?": "¿Ya tienes un espacio de trabajo?",
    "New to Paylink?": "¿Nuevo en Paylink?", "Create an account": "Crear una cuenta",
    "Workspace": "Espacio de trabajo", "Your business, connected": "Tu negocio, conectado", "YOUR WORKSPACE": "TU ESPACIO DE TRABAJO",
    "Overview": "Resumen", "Payment links": "Enlaces de pago", "Payments": "Pagos", "Company settings": "Configuración de empresa",
    "Sign out": "Cerrar sesión", "A link that looks like you.": "Un enlace que se parece a ti.",
    "Add your logo and colors to make every payment feel personal.": "Añade tu logo y colores para que cada pago sea personal.",
    "Make it yours": "Hazlo tuyo", "Create a payment link": "Crear enlace de pago",
    "A PAYMENT REQUEST, JUST FOR YOU": "UNA SOLICITUD DE PAGO SOLO PARA TI", "Review the details. Pay your way.": "Revisa los detalles. Paga a tu manera.",
    "Payment confirmed": "Pago confirmado", "Payment could not be verified": "No se pudo verificar el pago",
    "You’ve done your part.": "Has hecho tu parte.", "View & download receipt": "Ver y descargar recibo",
    "Choose how to pay": "Elige cómo pagar", "PAYMENT DETAILS": "DETALLES DEL PAGO", "Your full name": "Tu nombre completo",
    "Email for your receipt": "Correo para tu recibo", "Transfer reference (optional)": "Referencia de transferencia (opcional)",
    "I’ve made the payment": "He realizado el pago", "Loading payment details…": "Cargando detalles del pago…",
    "Image": "Imagen", "PDF": "PDF", "Confirmed by company": "Confirmado por la empresa", "RECEIVED FROM": "RECIBIDO DE",
    "PAYMENT METHOD": "MÉTODO DE PAGO", "CONFIRMED ON": "CONFIRMADO EL", "TRANSFER REFERENCE": "REFERENCIA DE TRANSFERENCIA",
    "RECEIPT NUMBER": "NÚMERO DE RECIBO", "Not supplied": "No proporcionado", "Issued by": "Emitido por",
    "Company saved successfully.": "Empresa guardada correctamente.", "New company": "Nueva empresa", "Your brand": "Tu marca",
    "Cancel new company": "Cancelar nueva empresa", "Add another company": "Añadir otra empresa", "Upload logo": "Subir logo",
    "Remove logo": "Eliminar logo", "Brand color": "Color de marca", "Save company": "Guardar empresa",
    "The details that make your payment page feel like you.": "Los detalles que hacen que tu página de pago se sienta como tú.",
    "Branding is used on payment pages. Confirmed receipts keep a snapshot of the brand and payment details at the time of approval.": "La marca se usa en las páginas de pago. Los recibos confirmados conservan una copia de la marca y los detalles del pago.",
    "Copied": "Copiado", "Copy this link manually": "Copia este enlace manualmente", "PAYMENT": "PAGO",
    "Your payment title": "Título de tu pago", "A personal payment experience, made for your customer.": "Una experiencia de pago personal, creada para tu cliente.",
    "Total amount": "Importe total", "Could not export the receipt. Please try again.": "No se pudo exportar el recibo. Inténtalo de nuevo.",
    "Transfer the amount using these details before reporting payment below.": "Transfiere el importe usando estos datos antes de informar del pago abajo.", "Transaction ID or bank reference": "ID de transacción o referencia bancaria", "I have transferred the amount using the payment details above. I understand the company will verify receipt.": "He transferido el importe usando los datos de pago anteriores. Entiendo que la empresa verificará la recepción.", "Payment request by": "Solicitud de pago de", "the company": "la empresa", "Powered by": "Con tecnología de", "Only the company can confirm funds have arrived.": "Solo la empresa puede confirmar que los fondos han llegado.", "Your company has confirmed receipt of your payment.": "La empresa ha confirmado la recepción de tu pago.", "Please contact the company to resolve your payment.": "Contacta con la empresa para resolver tu pago.", "Your payment report is awaiting company confirmation. Keep this page to check its status.": "Tu reporte de pago espera la confirmación de la empresa. Conserva esta página para consultar su estado.", "Submit another report": "Enviar otro reporte",
    "YOURS TO KEEP": "PARA QUE LO CONSERVES", "A little proof. A lot of peace of mind.": "Una pequeña prueba. Mucha tranquilidad.", "following confirmation of funds.": "tras la confirmación de los fondos.",
    "MAKE IT PERSONAL": "HAZLO PERSONAL", "Your details. Your branding. Ready to share.": "Tus datos. Tu marca. Listo para compartir.", "Cancel": "Cancelar", "Payment title": "Título del pago", "Description": "Descripción", "Amount": "Importe", "Currency": "Moneda", "Payment category": "Categoría de pago", "Recipient name (private, optional)": "Nombre del destinatario (privado, opcional)", "Recipient email (private, optional)": "Correo del destinatario (privado, opcional)", "Ways to pay": "Formas de pago", "List only methods your company can receive. Enter the exact account, wallet, email, network, or transfer instructions the customer needs.": "Indica solo métodos que tu empresa pueda recibir. Introduce la cuenta, cartera, correo, red o instrucciones exactas que necesita el cliente.", "Method": "Método", "Remove payment method": "Eliminar método de pago", "Method name": "Nombre del método", "Payment destination & instructions": "Destino e instrucciones de pago", "Add a payment method": "Añadir un método de pago", "Page style": "Estilo de página", "Cover image or video": "Imagen o vídeo de portada", "Cloudinary upload · up to 20 MB": "Subida a Cloudinary · hasta 20 MB", "Remove cover": "Eliminar portada", "Additional notes or terms": "Notas o condiciones adicionales", "Receipt heading": "Encabezado del recibo", "Receipt message": "Mensaje del recibo", "Save & create link": "Guardar y crear enlace", "LIVE PREVIEW": "VISTA PREVIA EN VIVO", "A little preview of a great first impression.": "Una pequeña vista previa de una gran primera impresión.", "Payment method": "Método de pago", "Payment receipt": "Recibo de pago", "Thank you for your payment. We appreciate your business.": "Gracias por tu pago. Agradecemos tu confianza.",
    "Spring semester tuition": "Matrícula del semestre de primavera", "Tell your customer what this payment is for.": "Indica a tu cliente para qué es este pago.", "Account name, bank, IBAN / SWIFT, PayPal email, or crypto address and network…": "Nombre de la cuenta, banco, IBAN / SWIFT, correo de PayPal o dirección y red de criptomonedas…", "Due dates, transfer fees, or important information.": "Fechas de vencimiento, comisiones de transferencia o información importante.", "Review payment": "Revisar pago", "Transfer reference": "Referencia de transferencia",
    "YOUR BUSINESS AT A GLANCE": "TU NEGOCIO DE UN VISTAZO", "Good to see you,": "Qué bueno verte,", "A little less chasing. A lot more getting paid.": "Un poco menos de perseguir pagos. Mucho más cobrar.", "Thoughtful payment experiences, one link at a time.": "Experiencias de pago cuidadas, enlace a enlace.", "Review reports and confirm funds in your own account.": "Revisa los reportes y confirma los fondos en tu propia cuenta.", "Create payment link": "Crear enlace de pago", "LOOK GOOD. GET PAID.": "CAUSA BUENA IMPRESIÓN. COBRA.", "One link. Your whole brand.": "Un enlace. Toda tu marca.", "Make your next payment request feel like a personal invitation.": "Haz que tu próxima solicitud de pago se sienta como una invitación personal.", "Create your first link": "Crea tu primer enlace", "Made for your business": "Hecho para tu negocio", "Ready to share": "Listo para compartir", "Beautifully simple": "Bonito y sencillo", "Confirmed payments": "Pagos confirmados", "Company-confirmed funds · latest 200 reports": "Fondos confirmados por la empresa · últimos 200 reportes", "Payment reports to check": "Reportes de pago por revisar", "Active payment links": "Enlaces de pago activos", "Ready for your customers · latest 200 links": "Listos para tus clientes · últimos 200 enlaces", "Your latest payment links": "Tus últimos enlaces de pago", "All payment links": "Todos los enlaces de pago", "Ready when your customers are.": "Listos cuando lo estén tus clientes.", "View all links": "Ver todos los enlaces", "Loading links…": "Cargando enlaces…", "Your first link starts here": "Tu primer enlace empieza aquí", "Create a branded payment request and share it with anyone.": "Crea una solicitud de pago con tu marca y compártela con quien quieras.", "Payment link": "Enlace de pago", "Status": "Estado", "Created": "Creado", "Actions": "Acciones", "Pause": "Pausar", "Activate": "Activar", "Payment reports": "Reportes de pago", "Confirm only after checking that funds arrived in your account.": "Confirma solo después de comprobar que los fondos llegaron a tu cuenta.", "Refresh": "Actualizar", "Nothing to review just yet": "Aún no hay nada que revisar", "Customer payment reports will appear here.": "Aquí aparecerán los reportes de pago de clientes.", "Customer": "Cliente", "Action": "Acción", "Review": "Revisar", "Receipt": "Recibo", "Good business starts with a little trust.": "Un buen negocio empieza con un poco de confianza.", "Made personal with paylink": "Hecho personal con paylink", "PAYMENT REVIEW": "REVISIÓN DEL PAGO", "Have the funds arrived?": "¿Han llegado los fondos?", "Check your bank, wallet, or payment account before confirming. This creates the customer’s official receipt.": "Revisa tu banco, cartera o cuenta de pago antes de confirmar. Esto crea el recibo oficial del cliente.", "Confirm funds received": "Confirmar fondos recibidos", "Reject report": "Rechazar reporte", "Toggle navigation": "Alternar navegación", "Select company": "Seleccionar empresa", "BUSINESS": "NEGOCIO", "FOR BUSINESS": "PARA NEGOCIOS",
  },
  ar: {
    "Language": "اللغة", "English": "الإنجليزية", "Español": "الإسبانية", "العربية": "العربية",
    "Opening your workspace…": "جارٍ فتح مساحة العمل…", "Loading receipt…": "جارٍ تحميل الإيصال…",
    "Page not found": "الصفحة غير موجودة", "Go to workspace": "الذهاب إلى مساحة العمل",
    "A MORE PERSONAL WAY TO GET PAID": "طريقة أكثر شخصية لتحصيل المدفوعات", "A BRAND THEY RECOGNIZE": "علامة تجارية يثقون بها",
    "Your business.": "أعمالك.", "Your brand.": "علامتك التجارية.", "Your payment link.": "رابط الدفع الخاص بك.",
    "Turn a simple request into a thoughtful payment experience. From the first link to the final receipt.": "حوّل طلبًا بسيطًا إلى تجربة دفع مميزة، من الرابط الأول حتى الإيصال النهائي.",
    "Every company, one workspace": "كل شركة في مساحة عمل واحدة", "Beautiful, branded receipts": "إيصالات جميلة تحمل علامتك التجارية",
    "Made for the way you do business.": "مصمم لأسلوب عملك.", "LET’S MAKE IT OFFICIAL": "لنبدأ رسميًا",
    "Create your workspace": "أنشئ مساحة عملك", "Welcome back.": "مرحبًا بعودتك.",
    "A better payment experience starts here.": "تبدأ تجربة دفع أفضل من هنا.",
    "Your companies and payment links are right here.": "شركاتك وروابط الدفع الخاصة بك هنا.",
    "Your name": "اسمك", "Company name": "اسم الشركة", "Email address": "البريد الإلكتروني",
    "Password": "كلمة المرور", "Use at least 12 characters.": "استخدم 12 حرفًا على الأقل.",
    "Create workspace": "إنشاء مساحة عمل", "Sign in": "تسجيل الدخول", "Already have a workspace?": "لديك مساحة عمل بالفعل؟",
    "New to Paylink?": "جديد على Paylink؟", "Create an account": "إنشاء حساب",
    "Workspace": "مساحة العمل", "Your business, connected": "أعمالك متصلة", "YOUR WORKSPACE": "مساحة عملك",
    "Overview": "نظرة عامة", "Payment links": "روابط الدفع", "Payments": "المدفوعات", "Company settings": "إعدادات الشركة",
    "Sign out": "تسجيل الخروج", "A link that looks like you.": "رابط يعكس هويتك.",
    "Add your logo and colors to make every payment feel personal.": "أضف شعارك وألوانك لتجعل كل دفعة شخصية.",
    "Make it yours": "اجعله خاصًا بك", "Create a payment link": "إنشاء رابط دفع",
    "A PAYMENT REQUEST, JUST FOR YOU": "طلب دفع مخصص لك", "Review the details. Pay your way.": "راجع التفاصيل وادفع بالطريقة التي تناسبك.",
    "Payment confirmed": "تم تأكيد الدفع", "Payment could not be verified": "تعذر التحقق من الدفع",
    "You’ve done your part.": "لقد أتممت ما عليك.", "View & download receipt": "عرض وتنزيل الإيصال",
    "Choose how to pay": "اختر طريقة الدفع", "PAYMENT DETAILS": "تفاصيل الدفع", "Your full name": "اسمك الكامل",
    "Email for your receipt": "بريدك الإلكتروني لاستلام الإيصال", "Transfer reference (optional)": "مرجع التحويل (اختياري)",
    "I’ve made the payment": "لقد أجريت الدفع", "Loading payment details…": "جارٍ تحميل تفاصيل الدفع…",
    "Image": "صورة", "PDF": "PDF", "Confirmed by company": "تم تأكيده من الشركة", "RECEIVED FROM": "مستلم من",
    "PAYMENT METHOD": "طريقة الدفع", "CONFIRMED ON": "تم التأكيد في", "TRANSFER REFERENCE": "مرجع التحويل",
    "RECEIPT NUMBER": "رقم الإيصال", "Not supplied": "غير متوفر", "Issued by": "صادر عن",
    "Company saved successfully.": "تم حفظ الشركة بنجاح", "New company": "شركة جديدة", "Your brand": "علامتك التجارية",
    "Cancel new company": "إلغاء الشركة الجديدة", "Add another company": "إضافة شركة أخرى", "Upload logo": "رفع الشعار",
    "Remove logo": "إزالة الشعار", "Brand color": "لون العلامة التجارية", "Save company": "حفظ الشركة",
    "The details that make your payment page feel like you.": "التفاصيل التي تجعل صفحة الدفع تعكس هويتك.",
    "Branding is used on payment pages. Confirmed receipts keep a snapshot of the brand and payment details at the time of approval.": "تُستخدم العلامة التجارية في صفحات الدفع، وتحافظ الإيصالات المؤكدة على نسخة من تفاصيلها وقت الموافقة.",
    "Copied": "تم النسخ", "Copy this link manually": "انسخ هذا الرابط يدويًا", "PAYMENT": "الدفع",
    "Your payment title": "عنوان الدفع", "A personal payment experience, made for your customer.": "تجربة دفع شخصية مصممة لعميلك.",
    "Total amount": "المبلغ الإجمالي", "Could not export the receipt. Please try again.": "تعذر تصدير الإيصال. يرجى المحاولة مرة أخرى.",
    "Transfer the amount using these details before reporting payment below.": "حوّل المبلغ باستخدام هذه التفاصيل قبل الإبلاغ عن الدفع أدناه.", "Transaction ID or bank reference": "معرف المعاملة أو المرجع البنكي", "I have transferred the amount using the payment details above. I understand the company will verify receipt.": "لقد حولت المبلغ باستخدام تفاصيل الدفع أعلاه. أفهم أن الشركة ستتحقق من الاستلام.", "Payment request by": "طلب دفع من", "the company": "الشركة", "Powered by": "مدعوم من", "Only the company can confirm funds have arrived.": "الشركة وحدها يمكنها تأكيد وصول الأموال.", "Your company has confirmed receipt of your payment.": "أكدت الشركة استلام دفعتك.", "Please contact the company to resolve your payment.": "يرجى التواصل مع الشركة لحل مشكلة دفعتك.", "Your payment report is awaiting company confirmation. Keep this page to check its status.": "تقرير الدفع بانتظار تأكيد الشركة. احتفظ بهذه الصفحة للتحقق من حالته.", "Submit another report": "إرسال تقرير آخر",
    "YOURS TO KEEP": "احتفظ به", "A little proof. A lot of peace of mind.": "دليل صغير وراحة بال كبيرة.", "following confirmation of funds.": "بعد تأكيد الأموال.",
    "MAKE IT PERSONAL": "اجعله شخصياً", "Your details. Your branding. Ready to share.": "تفاصيلك وهويتك التجارية، جاهزة للمشاركة.", "Cancel": "إلغاء", "Payment title": "عنوان الدفع", "Description": "الوصف", "Amount": "المبلغ", "Currency": "العملة", "Payment category": "فئة الدفع", "Recipient name (private, optional)": "اسم المستلم (خاص، اختياري)", "Recipient email (private, optional)": "بريد المستلم (خاص، اختياري)", "Ways to pay": "طرق الدفع", "List only methods your company can receive. Enter the exact account, wallet, email, network, or transfer instructions the customer needs.": "أدرج طرق الدفع التي يمكن لشركتك استلامها فقط. أدخل الحساب أو المحفظة أو البريد أو الشبكة أو تعليمات التحويل الدقيقة التي يحتاجها العميل.", "Method": "الطريقة", "Remove payment method": "إزالة طريقة الدفع", "Method name": "اسم الطريقة", "Payment destination & instructions": "وجهة الدفع والتعليمات", "Add a payment method": "إضافة طريقة دفع", "Page style": "نمط الصفحة", "Cover image or video": "صورة أو فيديو الغلاف", "Cloudinary upload · up to 20 MB": "رفع Cloudinary · حتى 20 ميجابايت", "Remove cover": "إزالة الغلاف", "Additional notes or terms": "ملاحظات أو شروط إضافية", "Receipt heading": "عنوان الإيصال", "Receipt message": "رسالة الإيصال", "Save & create link": "حفظ وإنشاء رابط", "LIVE PREVIEW": "معاينة مباشرة", "A little preview of a great first impression.": "معاينة صغيرة لانطباع أول رائع.", "Payment method": "طريقة الدفع", "Payment receipt": "إيصال الدفع", "Thank you for your payment. We appreciate your business.": "شكرًا لدفعتك. نقدر ثقتك بنا.",
    "Spring semester tuition": "رسوم الفصل الدراسي الربيعي", "Tell your customer what this payment is for.": "أخبر عميلك الغرض من هذا الدفع.", "Account name, bank, IBAN / SWIFT, PayPal email, or crypto address and network…": "اسم الحساب أو البنك أو IBAN / SWIFT أو بريد PayPal أو عنوان وشبكة العملات المشفرة…", "Due dates, transfer fees, or important information.": "تواريخ الاستحقاق أو رسوم التحويل أو معلومات مهمة.", "Review payment": "مراجعة الدفع", "Transfer reference": "مرجع التحويل",
    "YOUR BUSINESS AT A GLANCE": "نظرة سريعة على أعمالك", "Good to see you,": "سعداء برؤيتك،", "A little less chasing. A lot more getting paid.": "مطاردة أقل للمدفوعات، وتحصل على المزيد.", "Thoughtful payment experiences, one link at a time.": "تجارب دفع مميزة، رابطًا تلو الآخر.", "Review reports and confirm funds in your own account.": "راجع التقارير وأكد الأموال في حسابك الخاص.", "Create payment link": "إنشاء رابط دفع", "LOOK GOOD. GET PAID.": "مظهر رائع. مدفوعات أسرع.", "One link. Your whole brand.": "رابط واحد، هويتك كاملة.", "Make your next payment request feel like a personal invitation.": "اجعل طلب الدفع القادم يبدو كدعوة شخصية.", "Create your first link": "أنشئ رابطك الأول", "Made for your business": "مصمم لأعمالك", "Ready to share": "جاهز للمشاركة", "Beautifully simple": "بسيط وجميل", "Confirmed payments": "المدفوعات المؤكدة", "Company-confirmed funds · latest 200 reports": "أموال أكّدتها الشركة · آخر 200 تقرير", "Payment reports to check": "تقارير الدفع للمراجعة", "Active payment links": "روابط الدفع النشطة", "Ready for your customers · latest 200 links": "جاهزة لعملائك · آخر 200 رابط", "Your latest payment links": "أحدث روابط الدفع لديك", "All payment links": "كل روابط الدفع", "Ready when your customers are.": "جاهزة عندما يكون عملاؤك جاهزين.", "View all links": "عرض كل الروابط", "Loading links…": "جارٍ تحميل الروابط…", "Your first link starts here": "رابطك الأول يبدأ هنا", "Create a branded payment request and share it with anyone.": "أنشئ طلب دفع بهويتك التجارية وشاركه مع أي شخص.", "Payment link": "رابط الدفع", "Status": "الحالة", "Created": "تاريخ الإنشاء", "Actions": "الإجراءات", "Pause": "إيقاف مؤقت", "Activate": "تفعيل", "Payment reports": "تقارير الدفع", "Confirm only after checking that funds arrived in your account.": "أكد فقط بعد التحقق من وصول الأموال إلى حسابك.", "Refresh": "تحديث", "Nothing to review just yet": "لا يوجد ما تراجعه بعد", "Customer payment reports will appear here.": "ستظهر تقارير دفع العملاء هنا.", "Customer": "العميل", "Action": "الإجراء", "Review": "مراجعة", "Receipt": "الإيصال", "Good business starts with a little trust.": "الأعمال الجيدة تبدأ بقليل من الثقة.", "Made personal with paylink": "تجربة شخصية مع paylink", "PAYMENT REVIEW": "مراجعة الدفع", "Have the funds arrived?": "هل وصلت الأموال؟", "Check your bank, wallet, or payment account before confirming. This creates the customer’s official receipt.": "تحقق من بنكك أو محفظتك أو حساب الدفع قبل التأكيد. سيؤدي هذا إلى إنشاء إيصال العميل الرسمي.", "Confirm funds received": "تأكيد استلام الأموال", "Reject report": "رفض التقرير", "Toggle navigation": "تبديل التنقل", "Select company": "اختيار الشركة", "BUSINESS": "للأعمال", "FOR BUSINESS": "للأعمال",
  },
};

const LocaleContext = createContext<{
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (value: string) => string;
}>({ locale: "en", setLocale: () => undefined, t: (value) => value });

function localeFromPath(pathname: string): Locale | undefined {
  const candidate = pathname.split("/")[1];
  return candidate === "en" || candidate === "es" || candidate === "ar" ? candidate : undefined;
}

export function LocaleProvider({ children }: { children: ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [locale, setCurrentLocale] = useState<Locale>(() => {
    const fromPath = localeFromPath(window.location.pathname);
    const saved = localStorage.getItem("paylink-locale");
    return fromPath || (saved === "es" || saved === "ar" ? saved : "en");
  });

  useEffect(() => {
    const fromPath = localeFromPath(location.pathname);
    if (fromPath && fromPath !== locale) setCurrentLocale(fromPath);
  }, [location.pathname, locale]);

  useEffect(() => {
    localStorage.setItem("paylink-locale", locale);
    document.documentElement.lang = locale;
    document.documentElement.dir = locales[locale].dir;
  }, [locale]);

  const value = useMemo(() => ({
    locale,
    setLocale: (next: Locale) => {
      setCurrentLocale(next);
      localStorage.setItem("paylink-locale", next);
      const parts = location.pathname.split("/");
      if (localeFromPath(location.pathname)) parts[1] = next;
      else parts.splice(1, 0, next);
      navigate(`${parts.join("/")}${location.search}${location.hash}`);
    },
    t: (value: string) => translations[locale][value] || value,
  }), [locale, location, navigate]);

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useI18n() {
  return useContext(LocaleContext);
}

export function LanguageSwitcher() {
  const { locale, setLocale, t } = useI18n();
  return (
    <details className="language-switcher">
      <summary aria-label={t("Language")}><Globe2 size={16} /><span>{t("Language")}</span></summary>
      <div className="language-menu">
        {(Object.keys(locales) as Locale[]).map((code) => (
          <button key={code} className={locale === code ? "selected" : ""} onClick={() => setLocale(code)}>
            <Flag country={locales[code].country} />
            <span>{locales[code].name}</span>
            {locale === code && <Check size={14} />}
          </button>
        ))}
      </div>
    </details>
  );
}

function Flag({ country }: { country: string }) {
  const designs: Record<string, ReactNode> = {
    gb: <><path fill="#012169" d="M0 0h24v16H0z"/><path stroke="#fff" strokeWidth="3" d="M0 0l24 16M24 0L0 16"/><path stroke="#C8102E" strokeWidth="1.5" d="M0 0l24 16M24 0L0 16"/><path stroke="#fff" strokeWidth="5" d="M12 0v16M0 8h24"/><path stroke="#C8102E" strokeWidth="3" d="M12 0v16M0 8h24"/></>,
    es: <><path fill="#AA151B" d="M0 0h24v16H0z"/><path fill="#F1BF00" d="M0 4h24v8H0z"/></>,
    sa: <><path fill="#006C35" d="M0 0h24v16H0z"/><path stroke="#fff" strokeWidth="1.2" d="M6 11h12"/><circle cx="12" cy="6" r="2.2" fill="#fff"/></>,
  };
  return <svg className="language-flag" viewBox="0 0 24 16" role="img" aria-label={country}>{designs[country]}</svg>;
}

export function localizedPath(path: string, locale: Locale) {
  return `/${locale}${path.startsWith("/") ? path : `/${path}`}`;
}
