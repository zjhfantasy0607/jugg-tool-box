import { PhotoView } from 'react-photo-view';
import Image from 'next/image';
import Link from 'next/link';

const outputPath = process.env.NEXT_PUBLIC_OUTPUT_PATH as string;
const uploadPath = process.env.NEXT_PUBLIC_UPLOAD_PATH as string;

export default function ImgCard({
    title,
    url,
    imgurl
}: {
    url: string
    imgurl: string
    title: string
}) {
    const thumb = `${outputPath}/thumb/${imgurl}`;
    const origin = outputPath + imgurl;

    return (
        <div
            style={{ boxShadow: `0 0 20px -5px rgba(20, 20, 20, .2)` }}
            className="group relative rounded-md overflow-hidden cursor-pointer transition-all duration-[300ms] ease-in-out card-move-up-3 hover:shadow-none "
        >
            <div className="relative aspect-[9/13] overflow-hidden">
                <Image
                    sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 20vw, 15vw"
                    src={thumb} alt="" fill priority className="rounded-md" style={{ objectFit: "cover", objectPosition: "center" }}
                />
            </div>

            <div
                style={{ backgroundImage: 'linear-gradient(to right,rgba(0,0,0,.8) 0%,rgba(0,0,0,.2) 80%)' }}
                className="w-full h-full absolute inset-0 transition-all duration-[300ms] ease-in-out opacity-0 hover:opacity-100 text-white p-3"
            >
                <div className="float-right flex flex-col">
                    <Link href={url} className="btn btn-info h-6 min-h-6 mb-1.5">生成</Link>
                    <PhotoView src={origin}>
                        <button className="btn btn-success h-6 min-h-6">查看</button>
                    </PhotoView>
                </div>
                {title}
            </div>
        </div>
    );
}