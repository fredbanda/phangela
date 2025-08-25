import Link from 'next/link';
import WhatsApp from "../../assets/whatsapp.png"
import Image from 'next/image';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <footer>
      
      <div className="bg-gray-700 py-4 text-gray-100 fixed bottom-0 left-0 right-0">
        <div className="container mx-auto px-4">
          <div className="-mx-4 flex flex-wrap justify-between">
            <div className="px-4 w-full text-center sm:w-auto sm:text-left">
              Copyright © {currentYear}. All Rights Reserved.
            </div>
            <Link href="https://wa.me/27814402910">
                <Image src={WhatsApp} alt="WhatsApp" className="w-10 h-10 mr-2 items-center" />
              </Link>

            <div className="px-4 w-full text-center sm:w-auto sm:text-left">
              Made with ❤️ by Fred. 
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
