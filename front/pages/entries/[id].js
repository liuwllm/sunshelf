import Navbar from '@/components/navbar';
import Navbuttons from '@/components/navbuttons';
import CardSelection from '@/components/cardselection';
import CardGallery from '@/components/cardgallery';

export default function Post({ data, id, offset }) {   
    return (
    <main className='bg-red-100 min-h-auto font-sans m-0 p-0'>
        <Navbar title={data['title']} />
        <CardSelection />
        <CardGallery words={data['words']} />
        <Navbuttons words={data['words']} id={id} offset={offset} />
    </main>
    );
}

export async function getServerSideProps(context) {
    const id = context.query.id
    const offset = context.query.offset
    
    const res = await fetch(`https://sunshelf-back.onrender.com/worddata?_id=${id}&offset=${offset}`)
    const data = await res.json()

    // Pass data to the page via props
    return { props: { data, id, offset } }
}