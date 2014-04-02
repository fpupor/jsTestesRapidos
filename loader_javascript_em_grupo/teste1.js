vagina = function(group){
	this.group = false;
	this.compare = true;
	this.pronto = false;
	this.call = true;
	this.parent = false;
	
	this.initialize = function(group)
	{
		this.group = group;
		
		for(var currentGroup in this.group)
		{
			this.group[currentGroup].parent = this;
		}
	}
	
	this.check = function(recursion)
	{		
		var compare = this.compare;
		
		if(this.group)
		{
			for(var currentGroup in this.group)
			{
				compare = compare && this.pronto && this.group[currentGroup].check(true);
			}
		}
		else
		{
			compare = this.pronto
		}
		
		if(this.parent && !recursion)
		{
			if(this.parent.check())
			{
				this.parent.callFunction();
			}
		}
		
		return compare;
	}
	
	this.addInGroup = function(name,classe)
	{
		classe.parent = this;
		this.group[name] = classe;
	}
	
	this.setPronto = function()
	{
		this.pronto = true;
		this.check();
	}
	
	this.setFunctionCall = function(functionCall,bindObject,bindArguments)
	{
		this.functionCall = functionCall;
		this.bindObject = bindObject;
		this.bindArguments = bindArguments;
	}
	
	this.callFunction = function()
	{
		if(!this.functionCall)
			return false;
		this.functionCall.apply(this.bindObject,this.bindArguments);
	}
	
	if(group) 
		this.initialize(group);
}