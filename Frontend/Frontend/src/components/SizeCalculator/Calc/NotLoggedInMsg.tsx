export const NotLoggedInMsg = () => {
    return (
        <>        
          <p className="text-black ml-2 text-xl">
              Du måste vara inloggad för att kunna spara dina mått.
          </p>         
          <section>
            <button className="text-black get-size">Gå till inloggningen</button>
          </section>
        </>
    )
}