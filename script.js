document.addEventListener("DOMContentLoaded",()=>{
    const loginForm=document.getElementById("loginForm");
    const errorElement=document.getElementById("error");
    if(loginForm){
        loginForm.addEventListener("submit",(event)=>{
            event.preventDefault();
            const email=document.getElementById("email").value;
            const password=document.getElementById("password").value;
            if(email==="admin@empher.com" && password==="empher@123"){
                alert("Logged in as admin");
                saveLoginData("admin",email);
                window.location.href="admin.html";

            }else if(email==="user@empher.com" && password==="user@123"){
                alert("Logged in as user");
                saveLoginData("user",email);
                window.location.href="books.html";
            } else{
                errorElement.textContent="Invalid credentials. Please try again.";
            }

        });
    }
    const bookForm=document.getElementById("bookForm");
    if(bookForm){
        bookForm.addEventListener("submit",async(event)=>{
            event.preventDefault();
            const title=document.getElementById("title").value;
            const author=document.getElementById("author").value;
            const category=document.getElementById("Category").value;
            const newBook={title,author,category,isVerified:false};
            try{
                await fetch("https://jsonplaceholder.typicode.com/posts",{
                    method:"POST",
                    headers:{"Content-Type":"application/json"},
                    body:JSON.stringify(newBook),
                });
                alert("Book added sucessfully");
                fetchBooks();
            }catch(error){
                console.error("Errror adding book:",error);
            }
        });
    }
    if(document.getElementById("booksContainer")){
        fetchBooks();
    }
});
function checkAdminAuthorization(){
    const loginData=JSON.parse(localStorage.getItem("loginData"));
    if(!loginData|| loginData.email!=="admin@empher.com"){
        alert("Admin not logged in");
        window.location.href="index.html";
    }
}
function saveLoginData(role,email){
    const loginData={
        role:role,
        email:email,
        timestamp:new Date().toISOString(),
    };
    localStorage.setItem("LoginData",JSON.stringify(loginData))
}
async function fetchBooks(){
    const booksContainer=document.getElementById("booksContaier");
    booksContainer.innerHTML="<p>Loading books...</p>";
    try{
        const response=await fetch("https://jsonplaceholder.typicode.com/posts");
        const books=await response.json();
        booksContainer.innerHTML="";
        books.forEach(books,index => {
            const bookcard=document.createElement("div");
            bookcard.innerHTML=`
            <h3>${book.title}</h3>
            <p><strong>Author:</strong>${book.author}</p></strong>
            <p><strong>Category::</strong>${book.category}</p></strong>
            <p><strong>Status:</strong>${book.isVerified?"Verified":"Not Verified"}</p></strong><p><strong>Author:</strong>${book.author}</p></strong>
            <button>${book.isVerified?"disabled":""}onclick="VerifyBooks(${index})>Verify Book</button>
            <button onclick="deletedBook(${index})"> Delete Book</button>`;
            booksContainer.appendChild(bookcard);
        });
    }catch(error){
        console.log("Error fetching books:",error);
    }
}
function verifyBook(index){
    if(confirm("Are you sure you want to verify this book?")){
        document.querySelectorAll(".book-card")[index].querySelector("button").disabled=true;
        alert("Book Verified sucessfully");
    }
}
async function deleteBook(index){
    if(confirm("Are you sure you want  to delete this books?")){
        try{
            await fetch(`https://jsonplaceholder.typicode.com/posts/${index+1}`,{
                method:"Delete",
            });
            alert("Book deleted sucessfully");
            fetchBooks();
        }catch(error){
            console.error("Error deleteing book:",error);
        }
    }
}