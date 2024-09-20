import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

export default function NotFound() {
    return (
        <div>
            <Navbar/>
            <div className="flex flex-col w-full h-full justity-center items-center">
                <img src="/404.gif" alt="page not found" />
            </div>
            <Footer/>
        </div>
    )
}
