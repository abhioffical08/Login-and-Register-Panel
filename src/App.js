import './App.css';

function App() {
  return (
    <> 
     <nav class="navbar">
    <div class="links" id="navbarLinks">
      <a href="#" class="nav-link active">Home</a>
      <a href="#" class="nav-link">About</a>
      <a href="#" class="nav-link">Pricing</a>
      <a href="#" class="nav-link">Gallery</a>
      <a href="#" class="nav-link">Contact</a>
      <div class="button-indicator"></div>
    </div>
    <button class="hamburger-btn" aria-label="Toggle navigation menu" id="hamburgerBtn">
      <span></span>
      <span></span>
      <span></span>
    </button>
  </nav>
  <div class="block glow">
    <section class="main">
    <h1>Upload PDF File</h1>

        <form action="/upload" method="POST" enctype="multipart/form-data" className='form'>
        <label className='lab1'> Upload Your Resume </label>
            <input type="file" 
            name="pdfFile" 
            accept=".pdf" required/>
          
            <button className='btn' type="submit">Upload</button>

        </form>


    </section>
  </div>
</>
  );
}

export default App;
