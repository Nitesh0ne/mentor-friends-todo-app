class Node:    
    def __init__(self, key):
        self.key = key
        self.left = None
        self.right = None
        self.height = 1  # new node height = 1


# Helper functions
def get_height(node):
    if not node:
        return 0
    return node.height


def get_balance(node):
    if not node:
        return 0
    return get_height(node.left) - get_height(node.right)

def right_rotate(y):
    x = y.left
    t2 = x.right

    x.right = y 
    y.left = t2

    y = 1 + max(get_height(y.left),get_height(y.right))
    x = 1 + max(get_height(x.left),get_height(x.right))

    return y

def left_rotate(x):
    y = x.right
    t2 = y.left

    y.left = x
    x.right = 2
    x = 1 + max(get_height(x.left),get_height(x.right))
    y = 1 + max(get_height(y.left),get_height(y.right))

    return x

def insert(node, key):

    if not node:
        return Node(key)
    
    if key < node.key:
        node.left = insert(node.left, key)
    
    else:
        node.right = insert(node.right, key)

    balance = get_balance(node)


    ##LL
    if balance > 1 and key < node.left.key:
        return right_rotate(node)
    
    ##RR
    if balance < -1 and key > node.right.key:
        return left_rotate(node)
    
    #LR 
    if balance > 1 and  key > node.left.key:
        node.left = left_rotate(node.left)
        return right_rotate(node)
    
    #RL 
    if balance < -1 and key < node.right.key:
         node.right = right_rotate(node.right)
         return left_rotate(node)
    
    return node


def in_order(root):
    if not root:
        return
    in_order(root.left)
    print(root.key, end=" ")
    in_order(root.right)


root = None 
for v in [3,5,6]:
    root = insert(root,v)


in_order(root)
