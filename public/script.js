// Initialize CodeMirror
const editor = CodeMirror.fromTextArea(document.getElementById('source-code'), {
    lineNumbers: true,
    mode: "text/x-java", // default mode
    theme: "default",
    matchBrackets: true
});


// Get elements
const outputArea = document.getElementById("output");
const runButton = document.getElementById("run-button");


// Change mode based on selected language
document.getElementById('language').addEventListener('change', function() {
    const lang = this.value;
    switch (lang) {
        case 'python':
            editor.setOption("mode", "text/x-python");
            editor.setValue(boilerplate.python);
            break;
        case 'java':
            editor.setOption("mode", "text/x-java");
            editor.setValue(boilerplate.java);
            break;
        case 'c':
            editor.setOption("mode", "text/x-csrc");
            editor.setValue(boilerplate.c);
            break;
        case 'cpp':
            editor.setOption("mode", "text/x-c++src");
            editor.setValue(boilerplate.cpp);
            break;
        default:
            editor.setOption("mode", "text/plain");
            editor.setValue('');
            break;
    }
});

// Boilerplate code
const boilerplate = {
    python: `# Python Boilerplate
def main():
    print("Hello, World!")

if __name__ == "__main__":
    main()`,
    
    java: `// Java Boilerplate
public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}`,
    
    c: `// C Boilerplate
#include <stdio.h>

int main() {
    printf("Hello, World!\\n");
    return 0;
}`,

    cpp: `// C++ Boilerplate
#include <iostream>
using namespace std;

int main() {
    cout << "Hello, World!" << endl;
    return 0;
}`
};

// Event Listener for Run Button
runButton.addEventListener("click", async () => {
       // Add 'active' class to simulate the button press
       runButton.classList.add("active");

    // Get code from CodeMirror and selected language
    const code = editor.getValue();
    const language = document.getElementById("language").value;
    const userInput = document.getElementById("input").value || "";

    console.log("Request Data:", { code, language, stdin: userInput });
  
    try {
      // Send POST request to backend
      const response = await fetch("http://localhost:3001/compile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
            code, 
            language,
            stdin: userInput, // Send input only if present
        }),
      });
  
      const result = await response.json();
      console.log("Response Data:", result);

        // Display output or error
        if (result.status === "Accepted") {
            outputArea.value = result.output || "No output.";
        } else {
            outputArea.value = result.error || "Error occurred.";
        }
    } catch (error) {
        console.error("Error:", error);
        outputArea.value = "Server error";
    } finally {
        // Remove 'active' class after button press simulation
        runButton.classList.remove("active");
    }
});   