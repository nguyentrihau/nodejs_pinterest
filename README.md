# nodejs_pinterest
------------------------------------- APi users --------------------------------------------

-- Permission:
+ getAllPermission (không cần token)
+ Có 5 bậc từ 0 - 4 + 0: banned: chỉ có thể lấy thông tin, ko thể sửa, xóa 
+ 1, 2: toàn quyền lấy, sửa, xóa thông tin của bản thân, ko dc sửa, xóa thông tin của người khác! 
+ + 3: Moderators: toàn quyền lấy, sửa, xóa thông tin của bản thân, dc ban user khác! 
+ + 4: Admin: Toàn quyền, có thể sửa, xóa thông tin của thành viên khác. 
+ !!! Chỉ được ban thành viên có permission nhỏ hơn bản thân, ko dc ban bản thân!


---- Sign in ----
    + email: string (require)
    + password: string (require)

---- Sign up ----
    + email: string (require)
    + password: string (require)
    + age: number (require)
    + avatar: tự động lấy default (not require)

----- Get current info (token require) ----------
+ Lấy thông tin của bản thân 

---- Get info by id (getUserInfo) ----
+ Lấy thông tin của người khác 

---- GetAllUser ----
+ Lấy thông tin của tất cả người dùng

---- avatarUpload (token require) ----
+ Cập nhật lại avatar của chính mình
+ Truyền vào token và form-data với key là avatar(file),value là chọn file hình ảnh

---- deleteUser (token require) ----
+ Xóa user theo params user_id
+ Chỉ ADMIN mới có quyền xóa

---- setPermission (token require) ----
+ truyền vào token và body:
  + users_id:number
  + permission_value:number
+ chỉ có ADMIN mới phân quyền được

---- banUser ----
+ Truyền vào token và params user_id
+ ADMIN -> MODE -> Member

---- unBanUser (token require) ----
+ Truyền vào token và params user_id
+ ADMIN -> MODE -> Member

---- deleteAvatar (token require) ----
+  Truyền vào Token và form-data
+ Xóa avatar bản thân, xóa xong sẽ trở về defaultAvatar

---- updateUser (token require) ----
+ Truyền vào Token và body(form-data):
  + age:number
  + user_name:string 
  + avatar: file image (not require)
  
----------------------------------- API img ----------------------------

---- getAllImg ----
+ Ai cũng có thể lấy và nhìn thấy tất cả (không cần token)

---- getImgID ----
+ Kiếm ảnh theo img_id của ảnh
+ Nếu truyền token thì sẽ hiện đã save hay chưa

---- imgUpload (token require) ----
+ Đăng hình ảnh lên bằng form-data:
    + Truyền vào token(Người dùng đang đăng nhập đăng ảnh lên)
    + imgUpload: file hình ảnh
    + img_name:string 
  - Giảm dung lượng ảnh đăng lên bằng sharp
  - check image đăng lên tối đã 6mb
  
---- deleteImg (token require) ----
+ Chỉ xóa dc ảnh của bản thân,:
+ Admin có toàn quyền xóa ảnh
 
---- getImgByUserId ----
+ Tìm ảnh theo user_id :
    + Truyền vào params :user_id
    + Ai cũng có thể tìm và nhìn thấy hình ảnh của người cần tìm

---- getImgByName ----
+ Tìm ảnh theo tên hình ảnh:
    + Truyền vào query : keyword = (tên muốn tìm) 
    + Ai cũng có thể tìm hình ảnh theo tên

---- imgUpdate (token require) ----
+ Cập nhật hình ảnh của mình theo img_id:
    + Form-data: - img_name:string (not require)
                 - imgUpdate:file hình ảnh (not require)

----------------------------------- comment ---------------------------------

---- postComment (token require) ----
+ Thêm comment vào ảnh :
    img_id: number, (require)
    comment_value: string (require)

---- deleteComment (token require) ----
+ Xóa comment theo ID cmt
    + Chỉ xóa dc cmt của bản thân
    + Admin toàn quyền xóa cmt

---- editComment (token require) ----
+ Edit cmt theo ID
    + Chỉ edit dc cmt của bản thân
    + Admin toàn quyền edit cmt

---- getCommentHistory (token require) ----
+ Tìm kiếm lịch sử cmt của bản thân

---- getCommentHistoryByID (token require) ----
+ Tìm kiếm lịch sử cmt của user bằng user_ID
+ Chỉ Admin mới dc quyền sử dụng

----------------------------------- save ---------------------------------

---- saveImg (token require) ----
+ Save ảnh bằng img_id

---- unsaveImg (token require) ----
+ Unsave ảnh bằng img_id

---- getSavedHistory (token require) ----
+ Lấy danh sách saved img của bản thân

---- getSavedHistoryByID (token require) ----
+ Lấy danh sách saved img của user bằng user_id
+ Chỉ admin dc sử dụng
    
     
