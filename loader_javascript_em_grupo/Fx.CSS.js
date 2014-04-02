/*
EXEMPLO

requer3 = new groupObserver();

requer2 = new groupObserver();

requer1 = new groupObserver();
requer1.addInGroup("requer3",requer3);

requisicao1 = new groupObserver({"Requer1":requer1,"Requer2":requer2});
requisicao1.setCallback(function(){
    alert("requisicao1 completaa");
})

requisicao2 = new groupObserver({"Requer3":requer3,"Requer2":requer2});
requisicao2.setCallback(function(){
    alert("requisicao2 completa!");
})

>>> requer3 = new groupObserver(); requer2 = new grou...function(){ alert("requisicao2 completa!"); })
>>> requer3.setReady();
>>> requer1.setReady();
>>> requer2.setReady();
>>> requisicao2.setReady();
>>> requisicao1.setReady();
-------------------------------------

IDEIA
recursao(id,pai)
{
	novoPai = new checkGroupFunctionsReturn();
	if(!pai)
	{
		novoPai.setFunctionCall(function(){
		    alert("olá");
		})
	}
	else
	{
		pai.addInGroup(id,novoPai);
		novoPai.parent = pai;
	}
	
	for(classe in config.classes[id].require)
	{
		recursao(classe,novoPai);
	}
}
*/
/*
EXEMPLO

requer3 = new groupObserver();

requer2 = new groupObserver();

requer1 = new groupObserver();
requer1.addInGroup("requer3",requer3);

requisicao1 = new groupObserver({"Requer1":requer1,"Requer2":requer2});
requisicao1.setCallback(function(){
    alert("requisicao1 completaa");
})

requisicao2 = new groupObserver({"Requer3":requer3,"Requer2":requer2});
requisicao2.setCallback(function(){
    alert("requisicao2 completa!");
})

>>> requer3 = new groupObserver(); requer2 = new grou...function(){ alert("requisicao2 completa!"); })
>>> requer3.setReady();
>>> requer1.setReady();
>>> requer2.setReady();
>>> requisicao2.setReady();
>>> requisicao1.setReady();
-------------------------------------

IDEIA
recursao(id,pai)
{
	novoPai = new checkGroupFunctionsReturn();
	if(!pai)
	{
		novoPai.setFunctionCall(function(){
		    alert("olá");
		})
	}
	else
	{
		pai.addInGroup(id,novoPai);
		novoPai.parent = pai;
	}
	
	for(classe in config.classes[id].require)
	{
		recursao(classe,novoPai);
	}
}
*//*
EXEMPLO

requer3 = new groupObserver();

requer2 = new groupObserver();

requer1 = new groupObserver();
requer1.addInGroup("requer3",requer3);

requisicao1 = new groupObserver({"Requer1":requer1,"Requer2":requer2});
requisicao1.setCallback(function(){
    alert("requisicao1 completaa");
})

requisicao2 = new groupObserver({"Requer3":requer3,"Requer2":requer2});
requisicao2.setCallback(function(){
    alert("requisicao2 completa!");
})

>>> requer3 = new groupObserver(); requer2 = new grou...function(){ alert("requisicao2 completa!"); })
>>> requer3.setReady();
*/