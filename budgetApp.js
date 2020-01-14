//Module writing procedure is written in notebook
/*var budgetController = (function(){
    var x=23;
    var add = function(a) {
        return a + x;
    }
    return {
        PublicTest: function(b) { 
            return add(b);

        }
    }

})();

var UIController = (function() {

//some coding 


})();
var controller = (function(budgetCtrl,UICtrl) {

    var z=budgetCtrl.PublicTest(5);
    return{
        anotherPublic:function(){                   //we dont have access from outside to z variable
            console.log(z);                         //so we have to create another method simply to     
                                                    //print this variable to the console. so we need to return an object once again.

        }

    }
    
})(budgetController,UIController);****************************************************************************************************************************
***************************************************************************************************************************************************************************
******************************************************************************************************************************************************************/
/////////////////////////////////////PROJECT STARTS*********************************************************************************************************************
var budgetController = (function() {
    var Expense = function (id , description , value ){
        this.id = id ;
        this.description = description ;
        this.value = value ;
        this.percentage = -1 ;

        };
        Expense.prototype.calcpercentage = function(totalincome) {
            if (totalincome > 0) {
                this.percentage = Math.round((this.value / totalincome)*100);
            }
            else {
                this.percentage = -1;
            }
        };
        Expense.prototype.getpercentage = function() {
            return this.percentage;
        };
    var Income = function (id , description , value ){
            this.id = id ;
            this.description = description ;
            this.value = value ;
        };
    var calculateTotal = function(type) {
        var sum=0;
        data.allItems[type].forEach(function(cur)  {
            sum += cur.value;

        });
        data.totals[type] = sum;

    };
    var data = {
        allItems : {
            inc : [],
            exp : []
        },
        totals : {
            exp : 0,
            inc : 0
        },
        budget : 0,
        percentage : -1
         
    };
    return {
        additem : function(type , des , val) {
            var newItem , ID;
            ID=0;
            // next ID = last ID + 1;

            //Create new ID
            if(data.allItems[type].length > 0) {

                ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
            }
            else {
                ID=0;
            }
            //Create new item base on the type inc or exp

            if (type === 'inc') {
                newItem = new Income (ID , des , val);
            }
            else if (type === 'exp') {
                newItem = new Expense (ID , des , val);
            }
            //Push new item into our data structure
            data.allItems[type].push(newItem);

            //return new element 
            return newItem;
        },
        deleteitem : function(type, id) {
            var ids, index;
            //id=6 ,index= [0 1 2 3 4]
            //       ids = [1 2 4 6 8];
            // index=3
            //data.allitems[type][id];
            ids = data.allItems[type].map(function(current){            //new method
                return current.id;
            });
            index = ids.indexOf(id);
            if (index !== -1){
                data.allItems[type].splice(index, 1);                   //new method
            }

        },
        calculateBudget : function(){

            //1.Calculate the total income and expense
            calculateTotal('inc'); 
            calculateTotal('exp');

            //2.Calculate the budget: income - expense

            data.budget = data.totals.inc - data.totals.exp ;

            //3.Calculate the percentage of income that we spent
            if(data.totals.inc > 0){
                data.percentage = Math.round((data.totals.exp / data.totals.inc)*100);

            }
            else {
                data.percentage = -1;
            }
          
        },
        calculatePercentages : function() {
            data.allItems.exp.forEach(function(cur)
            {   cur.calcpercentage(data.totals.inc);
            });

        },
        getpercentages : function() {
           var allperc = data.allItems.exp.map(function(cur){
               return cur.getpercentage();
           });
           return allperc;
        },
    
        getBudget : function() {
            return {
                budget : data.budget,
                totalInc : data.totals.inc,
                totalExp : data.totals.exp,
                percentage : data.percentage

            }
        },
       
        testing : function(){
            console.log(data); 
        }
    };
    
})();


var UIController = (function() {
    var DOMstrings = {
        DOMtype :'.add__type',
        DOMdescription : '.add__description',
        DOMvalue : '.add__value',
        button : '.add__btn',
        incomeContainer : '.income__list',
        expenseContainer : '.expenses__list',
        budgetLabel : '.budget__value',
        incomeLabel : '.budget__income--value',
        expenseLabel : '.budget__expenses--value',
        percentageLabel : '.budget__expenses--percentage',
        container : '.container',
        expPercLabel : '.item__percentage',
        DateLabel : '.budget__title--month'


    }
    var formatNumber = function(num, type) {
        var numsplit, int, dec ;
        /*
        + or - sign
        ,in thousands
        exactly 2 decimal points
        */
       num = Math.abs(num);
       num = num.toFixed(2);
       numsplit =num.split('.')
       int = numsplit[0];
       dec = numsplit[1];

       if (int.length > 3) {
           int = int.substr(0, int.length - 3) + ',' + int.substr(int.length - 3, 3)
       }
      
       return  (type === 'exp' ? '-' : '+' ) + ' ' + int + '.' + dec;


    }
    var NodeListforEach = function(list, callback) {
        for(i=0;i<list.length;i++) {
         callback(list[i],i);
        }
    }
   
     
    return {
        publicInput : function() {
            return {
                type : document.querySelector(DOMstrings.DOMtype).value,

                description : document.querySelector(DOMstrings.DOMdescription).value,

                value : parseFloat( document.querySelector(DOMstrings.DOMvalue).value)
            };
        },
        addListitem : function(obj, type){
            var html, newHtml;

            //Create an HTML string with placeholder text
            if(type === 'inc'){
            element = DOMstrings.incomeContainer;
            html='<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }   
            else if (type === 'exp'){    
            element = DOMstrings.expenseContainer;               
            html='<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }

            //Replace the placehodler text with some actual data
            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%', formatNumber(obj.value, type));

            //Insert the Html into the DOM
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
        },
        deletelistitem : function(selectorID){
            var el = document.getElementById(selectorID);               //new method
            el.parentNode.removeChild(el);
        },
        clearfields : function() {
            var fields, fieldsArr;
            
            fields = document.querySelectorAll(DOMstrings.DOMdescription + ' , ' + DOMstrings.DOMvalue);
            fieldsArr =  Array.prototype.slice.call(fields);
            fieldsArr.forEach(function(current, index, array){
                current.value="";
            });
            fieldsArr[0].focus();


        },
        displayBudget : function(obj) {
            var type
            obj.budget > 0 ? type = 'inc' : type = 'exp';
            document.querySelector(DOMstrings.budgetLabel).textContent =formatNumber(obj.budget, type) ;
            document.querySelector(DOMstrings.incomeLabel).textContent = formatNumber(obj.totalInc, 'inc') ;
            document.querySelector(DOMstrings.expenseLabel).textContent = formatNumber(obj.totalExp, 'exp');
            if(obj.percentage > 0){
                document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage + '%';
            }
            else {
                document.querySelector(DOMstrings.percentageLabel).textContent = '---';
            }
            },
            displayPercentages : function(percentage) {
               var field = document.querySelectorAll(DOMstrings.expPercLabel);

               NodeListforEach(field, function(current, index){
                   if(percentage[index] > 0) {
                       current.textContent = percentage[index] + '%';
                   }
                   else {
                       current.textContent = '---';
                   }
                
               });

            },
        displayDate : function() {
            var now, months, year, month, date;
            now = new Date();
            months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October',
                      'November', 'December'];
            year = now.getFullYear();
            month = now.getMonth();
            date = now.getDate();
            document.querySelector(DOMstrings.DateLabel).textContent = date + ' ' + months[month] + ' ' + year;
        },
        changedType : function(){
            var fields = document.querySelectorAll(
                DOMstrings.DOMtype + ',' +
                DOMstrings.DOMdescription + ',' +
                DOMstrings.DOMvalue  
            );
            NodeListforEach(fields, function(cur){
                cur.classList.toggle('red-focus');
            });
            document.querySelector(DOMstrings.button).classList.toggle('red') ;  
        },
        getDOMstrings : function() {

            return DOMstrings;

            }
    };

})();

var controller = (function(budgetCtrl,UICtrl) {
    var setupEvenlisteners = function() {
        var DOM = UICtrl.getDOMstrings();

        document.querySelector(DOM.button).addEventListener('click',CtrlAddItem);
    
    //we will add this event listener to the global document because this keypress event doesn't happens on any
    //specific  element but it happens on the global web page,so on the global document,anywhere in the document.
        document.addEventListener('keypress' , function(event){  
    
        if (event.keyCode === 13 || event.which === 13 ){
            CtrlAddItem();
            
        }
    });
    document.querySelector(DOM.container).addEventListener('click',CtrlDeleteItem);

    document.querySelector(DOM.DOMtype).addEventListener('change', UICtrl.changedType) ;
};
    var updateBudget = function(){

        //1.Calculate the budget
        
        budgetCtrl.calculateBudget();
    
        //2.return the budget
        budget = budgetCtrl.getBudget();

        //3. Display the budget on the UI
        
        UICtrl.displayBudget(budget);
    };
    var updatePercentage = function() {

        //1. Calculate percnetage

        budgetCtrl.calculatePercentages();

        //2. Read percentage from the budget controller

        var percn=budgetCtrl.getpercentages();

        //3. Update the UI with the new percentages

        UICtrl.displayPercentages(percn);
    };
    
    var CtrlAddItem = function(){

        var input,newItem;

        //1.Get the field input data
        
        input = UICtrl.publicInput();

        if(input.description !== '' && !isNaN(input.value) && input.value > 0){
            //2.Add the item to the budget controller

            newItem = budgetCtrl.additem(input.type, input.description, input.value);
    
            //3.add the item to the UI
        
            UICtrl.addListitem(newItem, input.type);

            //4.Clear the current values
        
            UICtrl.clearfields();

            //5.Calculate and update the budget
            
            updateBudget();

            //6. Calculate and update the percentage

            updatePercentage();

        }   
    };
    var CtrlDeleteItem = function(event) {
        var itemID,splitID,type,ID;
        itemID=event.target.parentNode.parentNode.parentNode.parentNode.id ;
        if(itemID){
            splitID = itemID.split('-');
            type = splitID[0];
            ID = parseInt(splitID[1]);

            //1. Delete the item from the Data Structure
            
            budgetCtrl.deleteitem(type, ID);

            //2. Delete the item from the UI

            UICtrl.deletelistitem(itemID);

            //3. Update and show the new budget

            updateBudget();

            //4.Calculate and update the percentage

            updatePercentage();

        }

    }  
    return {
        init : function() {
            console.log('Application has started');
            UICtrl.displayDate();
            UICtrl.displayBudget({
                budget : 0,
                totalInc : 0,
                totalExp : 0,
                percentage : -1
             } );


            setupEvenlisteners();
        }
    }
    
})(budgetController,UIController);
controller.init();

