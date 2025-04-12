import Marquee from 'react-fast-marquee'

export function Marquee_Text({text, maxWidth='5rem', bold, id}) {
    
    return (
        <div className="marquee-text"
        style={{maxWidth, overflow : 'hidden'}}>
            <Marquee 
            pauseOnClick={true}
            delay={3}
            speed={15}
            >
                <p style={bold? {fontWeight : 'bold'} : {}}
                id={id}>{text + '\xA0'.repeat(10)}</p>
            </Marquee>
        </div>
    )

}