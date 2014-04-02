/**
 * Observa um grupo de objeto a ser setados como ready
 * quando todos do grupo estiverem como ready executa a(s) funcao do(s) parent(s)
 * @param (instancia da mesma classe)
*/
groupObserver = function(group){
	this.group = false; //grupo
	this.prepared = true; //status principal, nao alterar (inverte callback)
	this.ready = false; //status deste objeto, quando alterado foi carregado, executado etc
	this.call = true; //automatiza a chamada
	this.parents = false; //os pais do objeto
	
	/*
	 * Seta status do objeto como true
	 * apos verifica suas dependencias
	*/
	this.setReady = function()
	{
		this.ready = true;
		this.checkState();
	}
	
	/*
	 * Verifica o status do grupo de dependencia e retorna true
	 * Executa sua propia funcao de callback caso nao tenha um pai
	 * se existir pai executa sua propia funcao e checa se o pai esta preparado
	*/
	this.checkState = function(recursion)
	{		
		var prepared = this.prepared && this.ready;
		
		//caso nao esteja preparado
		if(!prepared)
			return false;
		
		//se existir grupo (recursiva)
		if(this.group)
		{
			for(var currentGroup in this.group)
			{
				prepared = prepared  && this.group[currentGroup].checkState(true);
			}
		}

		//esta tudo preparado inclusive o grupo e fora da recursao (evita um recall)
		if(prepared && !recursion)
		{	
			this.summonCallback();
			
			//caso exista pai checa o novo estado
			if(this.parents)
			{
				this.checkParentsState();
			}
		}
		
		return prepared;
	}
	
	/*
	 * Checa o estado dos pais
	*/
	this.checkParentsState = function()
	{
		for(var parent = 0; parent < this.parents.length; parent++)
		{
			this.parents[parent].checkState();
		}
	}
	
	/*
	 * Adiciona um grupo de objetos da mesma classe
	*/
	this.addGroup = function(group)
	{
		for(var groupName in group)
		{
			this.addInGroup(groupName,group[groupName]);
		}
	}
	
	/*
	 * Adiciona um objeto e adiciona seu novo pai
	*/
	this.addInGroup = function(name,classe)
	{
		if(!this.group)
			this.group = {};
		classe.addParent(this);
		this.group[name] = classe;
	}
	
	/*
	 * Seta a funcao de callback
	*/
	this.setCallback = function(functionCallback,bindObject,bindArguments)
	{
		this.functionCallback = functionCallback;
		this.bindObject = bindObject || null;
		this.bindArguments = bindArguments || [];
	}
	
	/*
	 * Executa a funcao de callback
	*/
	this.summonCallback = function()
	{
		if(!this.functionCallback || !this.call)
			return false;
		this.functionCallback.apply(this.bindObject,this.bindArguments);
		this.call = false;
	}
	
	/*
	 * Adiciona um novo pai
	*/
	this.addParent = function(parent)
	{
		if(!this.parents)
			this.parents = Array();
		this.parents.push(parent);
	}
	
	//adiciona o grupo caso passado na inicializacao
	if(group) 
		this.addGroup(group);
}

var config = {
	"accordion": {
		require : ["Fx.CSS","Fx.Marquee"]
	},
	"Fx.CSS": {
		require : ["Fx"]
	},
	"Fx.Marquee": {
		require : ["Fx"]
	},
	"thickbox": {
		require : ["Fx"]
	}
}

function createScript(name,current_config){
	current_config.embed 		= document.createElement('script');
	current_config.embed.id 	= name+"@embed";
	current_config.embed.name 	= name;
	current_config.embed.type 	= "text/javascript";
	current_config.embed.src 	= name+".js";
	
	current_config.embed.config = current_config;
	
	current_config.embed.onreadystatechange = function () {
		if (this.readyState == "complete"){
			this.config.observer.setReady();
			alert("ss")
		}
	}
	current_config.embed.onload = function(){
			this.config.observer.setReady();
	}
	
	document.getElementsByTagName("head")[0].appendChild(current_config.embed);
	
}

function createScriptAjax(name,current_config){
	if(window.XMLHttpRequest){
		var xmlhttp = new XMLHttpRequest();
		var printProperty = "innerText";
	}else if(window.ActiveXObject){
		var xmlhttp = ActiveXObject("Microsoft.XMLHTTP");
		var printProperty = "text";
	}
	
	if(xmlhttp != null)
	{
		current_config.embed 			= document.createElement('script');
		current_config.embed.id 		= name+"@embed";
		current_config.embed.name 		= name;
		current_config.embed.type 		= "text/javascript";
		
		xmlhttp.onreadystatechange = function()
		{
			if(xmlhttp.readyState == 4)
				if(xmlhttp.status == 200)
				{
					current_config.embed[printProperty]	= xmlhttp.responseText;
					current_config.embed.config 		= current_config;
					
					document.getElementsByTagName("head")[0].appendChild(current_config.embed);
					current_config.observer.setReady();
				}
				else
				{
					alert("erro de requisicao");
				}
		};
		xmlhttp.open("GET",name+"",true);
		xmlhttp.send(null);
	}
	else
		alert("seu browser nao suporta ajax.");
}

function require(name,fn,fnbind,fnargs){
	observerThisRequire = new groupObserver();
	observerThisRequire.setCallback(fn,fnbind,fnargs);
	observerThisRequire.addInGroup(name,incluir(name).observer);
	observerThisRequire.setReady();
	return observerThisRequire;
}

function incluir(name,fn,fnbind,fnargs){
	
	var current_config = config[name];
	
	if(!current_config)
	{
		config[name] 	= {};
		current_config 	= config[name];
	}
	
	if(!current_config.observer)
	{
		//console.group("GRUPO -> " + name);
		current_config.observer = new groupObserver();
		current_config.observer.setCallback(fn,fnbind,fnargs);
		if(current_config.require)
		{
			var requisitos = current_config.require;
			for(var at=0; at < requisitos.length; at++)
			{
				current_config.observer.addInGroup(requisitos[at],incluir(requisitos[at]).observer);
			}
		}
		
		if(!current_config.embed)
		{
			createScriptAjax(name,current_config);
		}
		//console.groupEnd();	
	}	
	
	return current_config;
}
function teste(){
requisicao3 = require("http://validator.w3.org/check?uri=http://www.quiness.com.br",function(){
    //alert("accordion CARREGADO")
});
requisicao4 = require("thickbox.extend",function(){
    alert("THICKBOX EXTEND CARREGADO")
});
}
function teste2(){
requisicao2 = require("thickbox",function(){
    alert("THICKBOX CARREGADO")
});
}
function teste3(){
requisicao2 = require("Fx.CSS",function(){
    alert("Fx CSS CARREGADO")
});
}