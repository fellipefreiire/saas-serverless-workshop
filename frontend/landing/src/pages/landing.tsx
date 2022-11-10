import * as S from '../styles/pages/landing'

export default function Landing() {

  return (
    <div>
      <nav>
        <a>AWS Serverless SaaS Reference Architecture</a>
        <button
          aria-controls="navbarSupportedContent"
          type="button"
          aria-label="Toggle navigation"
        >
          <span></span>
        </button>

        <div
          id="navbarSupportedContent"
        >
          <ul>
            <li>
              <a>Home <span>(current)</span></a
              >
            </li>
            <li>
              <a href="/register">Sign Up!</a>
            </li>
          </ul>
        </div>
      </nav>

      <header>
        <div>
          <h1>Serverless SaaS Reference Architecture</h1>
          <h2>It's so nice it blows your mind.</h2>
          <S.Button as='a' href="">Sign up now!</S.Button>
        </div>
      </header>

      <section>
        <div>
          <div>
            <div>
              <h3>Serverless SaaS Reference Architecture is so awesome.</h3>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Facere
                temporibus omnis illum, officia. Architecto voluptatibus commodi
                voluptatem perspiciatis eos possimus, eius at molestias quaerat
                magnam? Odio qui quos ipsam natus.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section>
        <div>
          <div>
            <i></i>
            <p>
              Serverless SaaS Reference Architecture so awesome. Makes you awesome - go sign up!
            </p>
          </div>
          <div>
            <i></i>
            <p>
              Serverless SaaS Reference Architecture so great. Makes you even greater - go sign
              up now. Super cheap deal!
            </p>
          </div>
          <div>
            <i></i>
            <p>Feel lonely? Go sign up and have a friend!</p>
          </div>
        </div>
      </section>

      <section>
        <div>
          <h3>Take Serverless SaaS Reference Architecture with you everywhere you go.</h3>
          <p>
            Serverless SaaS Reference Architecture is all you need. Anywhere - ever. Lorem ipsum
            dolor sit amet, consectetur adipisicing elit. Expedita sapiente hic
            voluptatum quo sunt totam accusamus distinctio minus aliquid quis!
          </p>
        </div>
      </section>

      <section>
        <div>
          <blockquote>
            <p>
              Love Serverless SaaS Reference Architecture. So nice! So good! Could not live
              without!
            </p>
            <cite> Satisfied Customer </cite>
          </blockquote>
        </div>
      </section>

      <section>
        <div>
          <h3>Reasons to sign up this product:</h3>
          <div>
            <ul>
              <li>Its the best</li>
              <li>Its awesome</li>
              <li>It makes you happy</li>
              <li>It brings world peace</li>
              <li>Its free!</li>
            </ul>
          </div>
          <div>
            <ul>
              <li>Its the best</li>
              <li>Its awesome</li>
              <li>It makes you happy</li>
              <li>It brings world peace</li>
              <li>Its free!</li>
            </ul>
          </div>
        </div>
      </section>

      <section>
        <div>
          <h3>Why you still reading?</h3>
          <a href="">Sign up now!</a>
        </div>
      </section>

      <footer>
        <div>
          <ul>
            <li><a href="#">SaaS Factory</a></li>
            <li><a href="#">Contact</a></li>
            <li><a href="#">Mainpage</a></li>
          </ul>
          <p>&copy; 2022 AWS SaaS Factory. All rights reserved.</p>
        </div>
      </footer>
    </div >
  )
}
