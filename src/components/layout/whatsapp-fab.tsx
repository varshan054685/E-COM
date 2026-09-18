import { WhatsAppIcon } from '@/components/icons/whatsapp-icon';
import { SITE, WHATSAPP_DEFAULT_MESSAGE, whatsappLink } from '@/lib/site';

/** Fixed bottom-right inquiry button, present on every page. */
export function WhatsAppFab() {
  return (
    <a
      href={whatsappLink(WHATSAPP_DEFAULT_MESSAGE)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Chat with ${SITE.shortName} on WhatsApp`}
      className="group fixed right-4 bottom-4 z-40 flex items-center gap-0 overflow-hidden rounded-full bg-[#25D366] p-3.5 text-white shadow-lift transition-all duration-300 ease-out-expo hover:gap-2 hover:bg-[#1DA851] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring sm:right-6 sm:bottom-6"
    >
      <WhatsAppIcon className="size-6 shrink-0" />
      <span className="max-w-0 overflow-hidden text-sm font-medium whitespace-nowrap transition-all duration-300 ease-out-expo group-hover:max-w-[9rem]">
        Chat with us
      </span>
    </a>
  );
}
