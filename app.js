const fs = require('fs');
const pdfparse = require('pdf-parse');


// Function to extract text from a PDF file


async function extractTextFromPDF(pdfPath) {
  try {
   
    pdfparse(pdfPath).then(function (data) {
       
      
   var title,docNo,Dated,Remarks,GrandTotal;

    console.log(`${pdfPath}`);

    for(let i=0;i<data.text.length-20;i++)
{
  // conditon for To:Title using the logic that is it followed by email and ends at char ']' 
  if(data.text.substr(i,7)=="Message")
  {
    i=i+9
    Remarks=data.text.substr(i,15)
  }
  if(data.text[i]==']')
  {
  var k =i;
   for( k=i;k>=10;k--)
   {
    if(data.text[k]=='m')
    {
      break;
    }
   }
   k=k+2
   var temp=""
   for(k=k;k<k+60;k++)
   {
    temp+=data.text[k]
    if(data.text[k]==']')
    {
      
      break;
    }
   
   }
   title=temp;
  }
    //For Dated just check whether the string Dated is present or not 
  if(data.text.substr(i,5)=="Dated")
  {
    Dated = data.text.substr(i,18);
  }
  // For Grand Total it is after the string Amount in words 
  if(data.text.substr(i,15)=="Amount in words")
  {
    var temp = "";
    i=i+18;
    while(data.text[i]!='.')
    {
      temp+=data.text[i]
      i++;
    }
    GrandTotal=temp;

  }
// Similar logic is for Doc No.
    if(data.text.substr(i,7)=="Doc No.")
    {
      i=i+7
      docNo=data.text.substr(i+1,14)
      // Syntax for exporting everything to excel
   

    //   console.log(title);
    //   console.log(docNo);
    //   console.log(Remarks);
    //   console.log(Dated);
    //   console.log(GrandTotal);

    
    }
}
const arr = [title,GrandTotal];
return arr

    });
   
  } catch (error) {
    console.error(`Error extracting text from ${pdfPath}:`, error.message);
    return null;
  }
}

// Function to iterate over each PDF file in a folder
async function processPDFsInFolder(folderPath) {
  try {
    // Get a list of files in the folder
    const files = fs.readdirSync(folderPath);

    // Iterate over each file
    for (const file of files) {
      // Check if the file has a .pdf extension
      if (file.toLowerCase().endsWith('.pdf')) {
        const pdfPath = `${folderPath}/${file}`;
        extractTextFromPDF(pdfPath)
        // Provide pdf path to the sync function to get the values
            
      
      }
    }
    // const result = await extractTextFromPDF(pdfPath);
    // Process the result as needed (e.g., export to Excel)
    // console.log("this is"+result);
    //Exporting to excel 

  } catch (error) {
    console.error('Error processing PDFs:', error.message);
  }
  
}

// Replace 'path/to/your/pdf/folder' with the path to your folder containing PDFs
const pdfFolder = './Folder';
processPDFsInFolder(pdfFolder);
