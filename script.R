# Author: Kaique Lupo Leite
# Title: Principal component analysis with Times World Ranking dataset.
# Date: 09/September/2017 


# ------------- Mathematical Manipultaion ------------

# Gets as input a matrix with n columns. For each column, calculates
# the z-score, or in other words, obtains a dimensionless quantity by
# subtracting the population mean from an individual raw score and them
# dividing the difference by the population stardard deviation.
z.score.matrix <- function(file){
        for(i in 1:ncol(file)){
                file[,i] = (file[,i]-mean(file[,i], na.rm = T))/sd(file[,i], na.rm = T)
        }

	return (file)
}

# ---------------------------------------------------


# ------------- Dataset Manipulation -----------------

# Opens a xlsx file.
open.xlsx <- function(path, na.symbol){
	require("readxl")
	return (read_excel(path, na = na.symbol))
}

# Returns a dataset without any instances with one or more NA variable's. 
clean.dataset <- function(file){
	index = which((apply(file, 1, function(x){sum(is.na(x))})) == 0)
	#dataset = file[index,]	

	return (index)
}


# The rank variable is numerical until the 200 position where it turns a 
# range representation. In order to create a color scale in the next steps,
# it is necessary to transform the rank variable into numerical. It
# is done by considering the range representation as the next position in the 
# rank and assign this value for all variables in this range.     
clean.rank <- function(vec){
	rank = as.matrix(vec)
	classes = unique(rank)

	for(i in 1:length(classes)){
		 rank[which(rank == classes[i])] = i
	}

	return (as.numeric(rank))
}

# Creates a color range between black and grey where it generates
# n colors, n being set by amount.
color.range <- function(amount){
	palette <- colorRampPalette(c("black", "grey"))(amount)
	
	return (palette)
}


#Times World Ranking Analysis function.
times.world.ranking.analysis <- function(){
	#Clean all the old connections and old variables assignments.
	closeAllConnections()
	rm(list=ls())

	#Opens the xlsx file considering the simbol "-" as NA in addition
	#to default values as blank space.
	file = open.xlsx("dataset.xlsx", "-")

	#Transforms the class variable to a numerical one.
	rank = clean.rank(file[,1])

	#Runs the PCA algorithm considering columns 4 to 8 and 10 to 13.
	analysis = pca(file[,c(4:8,10:13)], rank)
	
	#Creates a list to return all calculated variables.  
	ret = list()
	ret$analysis = analysis
	ret$names = colnames(file[,c(4:8,10:13)])

	return (ret)
}

# ---------------------------------------------------


# ----------------- PCA procedures ------------------

# Calculates PCA
pca <- function(file, classes){
	#Take out instances with at least one NA variable.
	idx = clean.dataset(data.matrix(file))	
	X = data.matrix(file)[idx,]
	classes = classes[idx]
	#Calculates the z-score for each column.
	X_std = z.score.matrix(X)
	#Calculates the covariance matrix. 
	cov_matrix = cov(X_std)
	#Calculates the spectral decomposition resulting in
	#eigenvalues and eigenvectors.
	eg = eigen(cov_matrix)

	#Transforms the original dataset into a dataset 
	#in the eigenvectors space.
	Y = as.matrix(X_std) %*% eg$vectors	
	
	#Calculates different data representation metrics.
	exp = explained.variance(eg)

	ret = list()
	ret$Y = Y
	ret$eg = eg
	ret$exp =  exp
	ret$X = X
	ret$cov = cov_matrix
	ret$classes = classes

	return (ret)
}

# Gets a spectral decomposition (eigenvalues and eigenvectors) in order to
# calculates the amount of data represented by each principal component and
# calculates the porcentage of contribution of each original attribute in 
# each principal component.
explained.variance <- function(eg){

	ret = list()
	#Data representation of each principal component.
	ret$per.component = 100*(eg$values/sum(eg$values))
	#Contribution of each original attribute in each principal component.
	ret$per.component.attribute = 100*apply(eg$vectors,2, function(x){x/sum(abs(x))}) 

	return (ret)
}

save.pca.to.tsv <- function(table, classes){
	table = cbind(table, classes)
	table = cbind(seq(1,nrow(table), 1), table)
	colnames(table) <- c("id","component1", "component2", "class")
	write.table(table, file="pca.tsv", quote=FALSE, sep='\t', row.names = FALSE)
}

save.dataset.to.tsv <- function(X, classes, names){
	table = cbind(X, classes)
	table = cbind(seq(1,nrow(X), 1), table)
	colnames(table) <- c("id", c(names, "class"))
	write.table(table, file="dataset.tsv", quote=FALSE, sep='\t', row.names = FALSE)
}

normalize <- function(table){
	for(i in 1:ncol(table)){
		table[,i] = (table[,i] - min(table[,i]))/(max(table[,i]) - min(table[,i]))
	}
	return (table)
}

calc.dist <- function(table){
	k = 1
	dist.list = list()
	for(i in 1:(nrow(table)-1)){
		print(i)
		for(j in (i+1):nrow(table)){
				dist.list[[k]] = c(i,j,dist(rbind(table[i,], table[j,])))
				k = k + 1
		}
	}

	return (dist.list)
}

# --------------------------------------------------