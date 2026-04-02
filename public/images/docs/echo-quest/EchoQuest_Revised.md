
# Echo Quest 技术实现文档

---

## 目录

- [1. GAS (Gameplay Ability System)](#1-gas-gameplay-ability-system)
  - [1.1 GAS 核心组件解析](#11-gas-核心组件解析)
  - [1.2 为什么要使用 GAS？](#12-为什么要使用-gas)
  - [1.3 以闪避为例，说明 GAS 在项目中的使用](#13-以闪避为例说明-gas-在项目中的使用)
- [2. 战斗系统实现（ComboGraph）](#2-战斗系统实现combograph)
  - [2.1 为什么要使用 ComboGraph？](#21-为什么要使用-combograph)
  - [2.2 以轻攻击 Combo 为例](#22-以轻攻击-combo-为例说明-combograph-在项目中的使用)
    - [2.2.1 动画蒙太奇的配置（AnimNotify）](#221-动画蒙太奇的配置animnotify)
    - [2.2.2 碰撞检测 ComboGraphCollision](#222-碰撞检测-combographcollision)
    - [2.2.3 基于动画通知状态的射线检测](#223-基于动画通知状态的射线检测ans-based-trace)
- [3. 打击感的构成与实现](#3-打击感的构成与实现)
  - [3.1 动作游戏打击感的构成](#31-动作游戏打击感的构成)
  - [3.2 以近战攻击为例](#32-以近战攻击为例说明索敌受击判定与表现在项目中的实现)
- [4. 角色动画系统（Lyra 动画蓝图 + 程序化动画修正）](#4-角色动画系统lyra-动画蓝图--程序化动画修正)
  - [4.1 技术选型分析](#41-技术选型分析为什么要用-lyra-架构而不用-als-或-motion-matching)
  - [4.2 Lyra 动画架构的核心技术优势](#42-lyra-动画架构的核心技术优势)
  - [4.3 以主角 AnimBP 为例](#43-以主角-animbp-为例说明-lyra-架构与程序化动画修正在项目中的实现)
  - [4.4 程序化物理修正 - Control Rig Foot IK](#44-程序化物理修正---control-rig-foot-ik)
- [5. Motion Warping](#5-motion-warping)
  - [5.1 什么是 Motion Warping？](#51-什么是-motion-warping)
  - [5.2 为什么要用 Motion Warping？](#52-为什么要用-motion-warping)
  - [5.3 以近战攻击吸附为例](#53-以近战攻击吸附为例讲解-motion-warping-在项目中的实现)
- [6. 敌人与 EQS](#6-敌人与-eqs)
  - [6.1 敌人 AI 架构体系](#61-敌人-ai-架构体系控制器与基类的模块化解耦)
  - [6.2 以近战敌人为例](#62-以近战敌人为例ai-实现全流程详解)
  - [6.3 空间智能：环境查询系统（EQS）](#63-空间智能环境查询系统eqs的原理与实践)

---

## 1. GAS (Gameplay Ability System)

### 1.1 GAS 核心组件解析

- **GameplayAbility (GA)**：在 GAS 系统中，当满足特定触发条件（即技能本身或角色持有指定的 Gameplay Tag）时，对应的 GameplayAbility 会被激活，并执行其关联蓝图 (Blueprint) 中的具体逻辑；

- **GameplayCue (GC)**：用于配置表现层逻辑（例如受击反馈、闪避特效等），通常在对应的 GameplayAbility 执行过程中被触发；

- **GameplayEffect (GE)**：用于配置技能的约束条件（Cost / Cooldown），动态地向角色赋予 Gameplay Tag（以配合 GameplayAbility 的触发判定），修改角色属性（如闪避时的耐力消耗、冷却时间），以及应用特定标签（如 BeingHit）来触发相应的受击效果。

**GAS 相关插件**：GameplayAbilities（引擎内置模块）、ComboGraph、GAS Companion

### 1.2 为什么要使用 GAS？

- **模块化与解耦**：GA 只管逻辑流程、状态机，GE 只管数值变化，GC 只管表现层，Attribute Set 只管角色基础属性数值，GE 用于配置技能的约束条件 (Cost / Cooldown)；

- **Tag-Based 的状态管理**：彻底告别 Bool 变量地狱，可以非常方便地管理不同状态间的触发、屏蔽逻辑关系；

- **复杂的数值运算系统 (Attribute Set)**：可以通过 GE 随时添加角色基础属性的影响 (Add / Multiply / Override)，避免算法逻辑重构；

- **网络同步与预测**：在联机游戏中可以很好地处理客户端预测，实现 Ability 激活、Attribute（血量/蓝量）和 Effect 的同步。

---

### 1.3 以闪避为例，说明 GAS 在项目中的实现

> **闪避完整数据流**：`玩家输入 → GSC_InputBinding → GA_Dodge → GE_Cost + GE_Cooldown → GameplayCue → Tag 管理 → GA 结束`

#### 1.3.1 角色基础属性定义 - GAS Attributes

闪避需要消耗耐力（角色基础属性）。Attribute Set 以数据表 (DataTable) 的形式存储玩家和敌人的基本信息，如生命值、耐力值、法力值。这样做非常便于维护与扩展，比如后面想再加入削韧值，便可在这里直接统一配置。

#### 1.3.2 接管玩家输入 - GSC_InputBinding

将玩家输入 (Player Input) 迁移至 GSC_InputBinding，实现对玩家输入的宏观统筹管理，并为每一个角色状态分配对应的 Gameplay Tag；

在玩家按下 Shift (IA_Dodge) 时，会运行 GA_Dodge (Gameplay Ability) 中的逻辑；可以理解为玩家的所有游戏性动作输入（如攻击、闪避、放技能等），都会激活一个对应的 Gameplay Ability，由 GA 统一接管具体的逻辑实现与状态判断。

#### 1.3.3 在 GA_Dodge 中执行闪避具体逻辑

能力激活后，首先判断玩家当前是否有方向输入。若输入向量的 XY 轴长度 ≤ 0（无水平输入），则开始判断玩家是否在空中 (IsFalling)，若两者都为否，则可认定当前玩家角色静止在原地；若有方向输入，则计算玩家最后输入的方向（决定闪避朝向）。

**若玩家有方向输入**：则瞬间旋转玩家 Actor 到上一帧的输入向量方向（这确保了 Dodge 会朝着玩家希望的方向执行），播放向前闪避的动画蒙太奇，获得玩家按下闪避时的位置——播放闪避粒子特效（Gameplay Cue），通过 Apply Root Motion Constant Force 节点接管角色的 CharacterMovementComponent，在设定的持续时间内持续不断地给角色施加一个向前力（好处是可以后期随时修改闪避的距离及持续时间，并且支持网络预测和同步）；

**若玩家静止在原地**：则直接播放向后闪避的动画蒙太奇，获得玩家按下闪避时的位置——播放闪避粒子特效（Gameplay Cue），通过 Apply Root Motion Constant Force 节点接管角色的 CharacterMovementComponent，在设定的持续时间内持续不断地给角色施加一个向后力（这里可以看到角色向后闪避的位移比向前闪避的要小，即体现了使用该节点接管的好处）。

#### 1.3.4 通过 Gameplay Cue 播放闪避时的粒子特效表现

Gameplay Cue 负责所有表现相关逻辑，由 GameplayCue Tag 触发。这样做最大的好处是节省带宽，服务器只需要发一个极其轻量的 Tag `GameplayCue.Character.Dodge.PrefectDodge`，客户端自己就知道该怎么、在哪播；

Gameplay Cue 分为两种，分别是 GameplayCueNotify_Static 和 GameplayCueNotify_Actor，前者主要用于播放一次性的效果（枪口火焰），而后者用于播放持续存在、需要 Tick 的特效（如拖尾）；

闪避粒子特效的 GameplayCue 逻辑：在执行时会获得 GameplayCue 的位置信息与执行者（玩家）的位置信息，通过 Spawn System Attached 在玩家位置生成闪避 Niagara VFX，并通过持续获得拥有该 GameplayCue 的 Actor 的位置信息（玩家位置），来实现粒子的拖尾跟随效果。

#### 1.3.5 在 GA_Dodge 执行时的 Tag 管理

在 GameplayAbility 中可以进行 Tag 的配置；

GA_Dodge 能力激活后，玩家会被添加上 `Ability.Character.Dodge` 的 Tag，在 GA 逻辑结束后会自动消失；

在 BlockAbilitiesWithTag 中可以配置这个 GA 激活期间禁止哪些 Tag (GA) 的执行。图中为：在角色闪避期间，角色不可以执行所有的 Ability（近战、远程攻击，闪避），同时也不可以执行 `Event.Character.Jump`（跳跃）。

#### 1.3.6 通过 GameplayEffect 添加耐力消耗和技能冷却时间

与此同时，在技能激活时，会触发 GE_Cost_Dodge 和 GE_Cooldown_Dodge 两个 Gameplay Effect。

#### 1.3.7 两种 GameplayEffect 的配置

- **GE_Cost_Dodge**：技能启动时自动触发该 GE，为步骤一中定义的 Attributes 中的 Stamina（耐力值）减 5；

- **GE_Cooldown_Dodge**：即在当前技能结束后为玩家添加 `Cooldown.Dodge` 的标签，持续 1 秒，在此期间玩家不可以再次触发该 GA。

#### 1.3.8 技能结束

闪避动画播放完成后即是闪避 GA 的结束。当闪避动画蒙太奇播放完成、混出、被打断或取消时结束技能状态；

结束时会移除所有与该 GA 相关的 Tag，并启动 Cooldowns 中的冷却时间。

---

## 2. 战斗系统实现（ComboGraph）

### 2.1 为什么要使用 ComboGraph？

ComboGraph 在项目中被定位为表现层（动画/连招）与逻辑层 (GAS) 间的桥梁；ComboGraph 负责处理角色的连招逻辑。它集成了连招输入及缓冲 (Input Buffering) 与攻击动画的播放管理，并负责与 GAS 系统对接，以分发和执行核心的攻击事件（包括造成伤害、计算技能消耗 Cost、以及触发 Gameplay Cues 的表现反馈）。

**系统构成**：ComboGraph 系统主要由以下两个核心组件构成：

- **ComboGraphCollision**：负责处理运行时的碰撞检测逻辑（见下文）；
- **Primary ComboGraphAsset**：定义连招节点与流程的数据资产。

![ComboGraph 资产文件夹结构（HeavyCombo / LightCombo 文件夹 + CG_HeavyAttackCombo / CG_LightAttackCombo 资产）](/images/docs/echo-quest/ch2-combat/combograph-folder-structure.png)

**为什么要与 GAS 对接？**

- **明确分工**：ComboGraph 管节奏——哪一帧可以取消后摇？哪一帧可以派生下一个攻击？这是动画状态机擅长的。而 GAS 管数值——扣多少角色属性、造成多少伤害、挂什么 Buff？这是 GAS 擅长的；

- 当 ComboGraph 判定攻击命中（Collision）或连招触发时，它不直接修改血量，而是发送一个 GameplayEvent 给 GAS，或者直接 Apply GameplayEffect。这样保证了逻辑的统一性。

**为什么要用 ComboGraph，而不用蓝图手搓连招逻辑？**（上一个项目中踩过的坑）

- **更清晰的可视化节点**：ComboGraph 提供了一个可视化的树状结构，每一个节点就是一个动作（Animation），每一条连线就是一个分支条件（Input）。在蓝图中则需要创建一个巨大的 Switch on Int（当前连招段数），然后接一堆 If 判断（是否按下攻击键、耐力够不够？）。一旦连招出现分支设计（如轻-重-轻），连线就会变得一团糟；

- **内置高精度输入缓冲（Input Buffering）机制**：这是动作游戏"手感"的灵魂，也是蓝图很难写好的地方。ComboGraph 自带 InputBuffer，在当前动作还在播放，但玩家输入了下一个动作时，系统会自动记录当前输入，并等当前动作结束后立刻自动衔接下一个动作。这能带来极度流畅的操作手感；

- **便于后期迭代**：ComboGraph 由数据驱动，修改时只需要在编辑器里拖拽节点、修改连线即可，而不用去蓝图里断开一堆连线，重新接线，甚至重写逻辑；

- **易于扩展复杂的派生机制**：动作游戏通常有复杂的派生，如 A →（按住）→ A（蓄力变招），在蓝图中实现停顿检测或长按检测并混在连招逻辑里最后一定会一团糟。而在 ComboGraph 中通常只是连线上的一个不同转换条件而已。

### 2.2 以轻攻击 Combo 为例，说明 ComboGraph 在项目中的实现

左边的部分解释了连招的逻辑，当玩家输入 LightCombo 的按键（鼠标左键）后，会在 PlayerBP 中执行这个 ComboGraph（从 Entry 开始）并播放第一段动画蒙太奇。下面的连线表示输入不同的按键会按顺序播放的对应动画蒙太奇（Combo 连段），轻攻击 Combo 共有四段，最后一段支持左右键轻重击转换。

右边的部分则是需要执行的具体内容，从上到下分别是：

- **动画**：播放对应的蒙太奇（蒙太奇中的 AN 与 ANS 也会一同被执行）并设置播放速率；
- **Gameplay Effects**：为 OnHit 物体发送 `Event.Montage` 标签，并且激活 GE_Damage_Melee（GameplayEffect）用来处理伤害计算，-5.0 是这段攻击的伤害值，并通过 GE_Cost_LightAttack 来声明耐力消耗；
- **Gameplay Cues**：在收到 `Event.Montage` 标签后处理的表现层效果，用以配置如受击位置的声音播放、粒子效果播放等。

![ComboGraph 轻攻击节点图（五段连招树状结构 + 右侧轨道属性面板）](/images/docs/echo-quest/ch2-combat/combograph-light-attack.png)

#### 2.2.1 动画蒙太奇的配置（AnimNotify）

AnimNotify 用于在动画播放到某个时间节点时，发送对应的信号通知或触发对应的逻辑。

目前一段攻击动画中，配置有以下几个 AnimNotify：

- **Motion Warping**：用于处理 Motion Warping 逻辑（下文会提到）；
- **Collision Window**：用于处理攻击的碰撞判定（下文会提到）；
- **Niagara VFX / Sound Effects**：用于播放武器攻击时的拖尾特效（Niagara VFX）和角色脚步声及武器攻击音效。

![动画蒙太奇 AnimNotify 配置（CollisionWind ANS 判定窗口、MotionWarp、NS_Stylized_Trail 拖尾特效、SFX 音效轨道）](/images/docs/echo-quest/ch2-combat/montage-anim-notify.png)

#### 2.2.2 碰撞检测 ComboGraphCollision

ComboGraphCollision 是挂载在发起攻击 Actor 上的一个组件，作用是处理攻击时的碰撞检测。

这个组件不仅仅是检测碰撞，它实际上充当了一个碰撞管理器的角色。它解决了使用 UE 原生碰撞（Overlap / Hit）难以解决的几个痛点（上一个项目的踩坑点）：

- **去重（Hit Deduping）**：一次挥剑动画持续 x 秒，每一帧都在做检测，如果前面已经打中过敌人，后续的帧就不应该再触发伤害，否则敌人会被秒杀。这个组件负责维护一个 HitActors 列表，确保一次挥击，每个敌人只受一次伤；

- **数据封装**：它可以直接把命中结果（HitResult）打包成 GAS 需要的 FGameplayEventData。

![BP_MainPlayer Components 面板 — ComboGraphCollision 组件与 GAS 核心组件（AbilitySystemComponent、GSCCore 等）并列挂载](/images/docs/echo-quest/ch2-combat/combograph-collision-component.png)

#### 2.2.3 基于动画通知状态的射线检测（ANS-based Trace）

- **静态网格体设置**：实现 ComboGraphCollision 的碰撞检测，首先需要在武器的模型 (StaticMesh) 上添加数个 Socket（插槽），这一步用以定义每个检测点的位置；

![武器 StaticMesh Socket 设置 — Socket 1 / Socket 2 定义检测起止点](/images/docs/echo-quest/ch2-combat/weapon-socket-setup.png)

- **动画配置**：在攻击动画序列 (Animation Sequence) 或蒙太奇 (Montage) 的关键帧轨道上，添加一个 AnimNotifyState (ANS)，即上文中的 Collision Window。起始点 (Notify Begin) 为攻击动作开始造成威胁的那帧，结束点 (Notify End) 为挥剑动作结束的那一帧。这一步定义了攻击的判定窗口；

- **运行时逻辑**：当攻击执行，动画播到 Collision Window ANS 的起始点时，组件开始工作。它会基于上一帧与当前帧的 Socket 位置差进行形状扫掠（支持 Line、Sphere、Box 或 Capsule），这能填补帧与帧间的空隙，形成一个连续、严密的扇面判定轨迹，从而完美解决低帧率下的穿模问题；

- **判定可视化**：紫色线框展示了攻击挥舞轨迹形成的连续扇面判定区域，当该区域与敌方碰撞体重叠时，绿色标记即为计算出的实际命中点 (Impact Point)。

![碰撞检测可视化 — 蓝色球体连线展示攻击挥舞的连续判定轨迹，橙色命中特效标记实际碰撞点](/images/docs/echo-quest/ch2-combat/collision-trace-visualization.png)

---

## 3. 打击感的构成与实现

### 3.1 动作游戏打击感的构成

（个人习惯按感官维度分类）

**视觉维度**：
- 角色动画（攻击前摇蓄力-剪影、攻击轨迹-刀光、攻击后摇-惯性）
- 命中反馈（顿帧 Hit Stop / 卡肉-表现阻力，根据武器重量、锋利程度及攻击力度决定）
- 受击位移、受击硬直（受击动画）
- 视觉特效（接触点特效-溅血火花烟尘等，特效方向通常与受击方向相反）
- 环境互动（地面/草）
- 屏幕特效（全屏暗角、后处理效果等）
- 相机（震屏-震动方向与攻击方向一致，震动幅度与伤害量相关、镜头推拉/变焦/特殊镜头）

**听觉维度**：
- 音效分层（挥动层、撞击层-材质区分/重击强低频、残响层-空间中的回声）
- 动态反馈（音调变化、暴击特殊处理）

**触觉与操控维度**：
- 手柄震动（震动层级区分-强度、方向性、阻尼）
- 输入与时机（输入缓冲-当前动作结束前缓存玩家输入，并根据优先级规则无缝衔接下一个动作）
- 受击时停（顿帧 Hit Stop - 改变玩家的按键输入节奏）

![近战攻击命中效果：命中点特效（紫色/蓝色 VFX）+ 法力值回复提示（+MANA!）](/images/docs/echo-quest/ch3-hit-feedback/hit-feedback-ingame.png)

### 3.2 以近战攻击为例，说明索敌、受击判定与表现在项目中的实现

#### 3.2.1 攻击启动与目标捕获

**触发阶段**：当玩家输入鼠标左键 (IA_LightAttack) 激活轻攻击 Ability 时，系统启动 LightAttack ComboGraph，并立即执行 GetLightAttackTarget 函数进行目标检索。

**广域筛选**：以角色为圆心，执行 Sphere Overlap（半径为 x），获取范围内除自身外的所有 Pawn 类 Actor。若无结果，函数结束。

**精细筛选**：对重叠检测到的结果进行三步过滤：
1. **标签检查**：剔除不包含 Attackable 标签的 Actor（过滤友军/非交互物），将所有未被剔除的 Actor 加入 HitActors 的 Array 中；
2. **距离校验**：计算玩家与目标的绝对距离，剔除距离大于 AttackAttachMinDist（配置的大吸附距离）的目标；
3. **最优解择取**：在剩余的候选列表中，选择距离玩家最近的 Actor 作为最终攻击目标（Target Actor）。

![索敌逻辑蓝图（Sphere Overlap 广域筛选 + 标签/距离三步过滤）](/images/docs/echo-quest/ch3-hit-feedback/target-acquisition.png)

**后续优化方向**：加入索敌加权评分系统：

> `Score = (距离 × W₁) + (与相机画面中心的角度偏差（点乘实现） × W₂) + (玩家当前推杆方向 × W₃) + (敌人是否处于特殊状态 × W₄)`
>
> 最终索敌目标为分数最高者。

![敌人受击效果实机截图（受击动画 + Hit Stop 顿帧反馈）](/images/docs/echo-quest/ch3-hit-feedback/enemy-hit-ingame.png)

#### 3.2.2 处理 OnHit 事件

当 ComboGraphCollision 组件检测到武器判定框与物体发生重叠时，会广播 On Hit Registered 事件，随即执行以下一系列逻辑：

**目标筛选**：首先进行目标筛选，防止对非敌对目标造成误伤。获取 Hit Result 中的 Hit Actor，检查其是否持有 Attackable 标签，只有持有该标签的 Actor（敌人）才会触发后续逻辑，否则直接终止。

**伤害与事件分发**：确认为合法目标后，调用 Report Damage Event 函数，传入受击者、施害者及伤害数值，处理基础扣血逻辑。

**GAS 事件负载构建**：使用 Make GameplayEventData 构建事件数据包，通过 Ability Target Data from Hit Result 将物理碰撞结果转换为 GAS 可识别的数据格式。

**发送 Gameplay Event**：向玩家自身（Self）发送带有 `Event.Montage` Tag 的事件，通知玩家的 GAS 系统攻击已命中，用于触发实现打击感的表现层反馈。

**资源回填（攻击回蓝）**：基于 GE_Mana_Regen 创建一个 Gameplay Effect Spec 实例后，利用 Assign Tag Set by Caller Magnitude 节点，通过标签 `SetByCaller.Mana` 动态设定恢复数值（可以避免在 GE 中写死数值，允许在蓝图中根据不同攻击连段灵活调整）。

**UI 更新**：最后调用 Show Mana UI，通知 UI 读取最新的 Attribute 属性值，刷新 HUD 上的法力条显示。

![OnHit 事件处理蓝图（Tag Check 标签筛选 + 伤害分发 + GAS 事件负载构建）](/images/docs/echo-quest/ch3-hit-feedback/on-hit-event.png)

#### 3.2.3 OnHit 后的数值与标签传递

在执行上述逻辑时，角色会向自身发送 `Event.Montage` 标签，并会被 ComboGraph 捕获，执行对应逻辑：首先，激活 GE_Damage_Melee（GameplayEffect）中的逻辑，分别是激活 GE_HitReaction_Melee，并修改 Health Attribute，数值为 Set by Caller，即 ComboGraph 中的 -5.0。随后激活 GE_Cost_LightAttack，用以处理该段攻击的耐力值消耗。

**GE_HitReaction_Melee**：在该 GameplayEffect 中，通过给目标 Actor（受击者）增加 `Event.Character.BeingHit.Melee` Tag 的方式，激活对方的受击 GameplayAbility。

这样写的好处是可以使用 SetByCaller 特性，通过单一 GE 实例处理动态伤害数值，方便后期修改并避免资产冗余；同时通过 Tags 触发受击反应，实现了攻击者与受击者的完全解耦（依赖倒置），受击表现由目标自身的 GAS 逻辑决定，可以很好地支持不同怪物类型的多态响应；并且通过将伤害、消耗与状态判定分离，极大降低了技能逻辑的耦合度，便于后续的 Buff 扩展。

![ComboGraph 节点的 Gameplay Effects 配置（GE_Damage_Melee + Set by Caller 动态伤害值）](/images/docs/echo-quest/ch3-hit-feedback/combograph-ge-config.png)

![GE_Damage_Melee Additional Effects 配置 — 内嵌激活 GE_HitReaction_Melee](/images/docs/echo-quest/ch3-hit-feedback/ge-damage-melee.png)

![GE_HitReaction_Melee Target Tags 配置 — Grant Event.Character.BeingHit.Melee 给受击 Actor](/images/docs/echo-quest/ch3-hit-feedback/ge-hit-reaction-tags.png)

#### 3.2.4 玩家侧打击感表现的实现

在玩家角色收到 `Event.Montage` 信号后，会同时执行 GameplayCues，用以执行玩家侧打击感表现；

在项目中分别为受击溅血特效、火花特效、击中点反馈特效和角色侧的打中音效；

这样写的好处是可以在 ComboGraph 中直观地根据每段不同的攻击动画，配置不同的玩家侧表现。

![玩家侧打击感表现（GameplayCue 触发溅血特效、火花特效、击中点反馈特效与音效）](/images/docs/echo-quest/ch3-hit-feedback/player-hit-feedback.png)

#### 3.2.5 敌人侧打击感表现的实现

目标角色收到 `Event.Character.BeingHit.Melee` 信号后，会执行 GA_HitReaction_Enemy_Melee，该 GA 由指定 Tag 触发，并执行其中的打击感实现逻辑。

目前 GA 中的打击感构成包含相机震动、音效播放、慢镜头、顿帧（Hit Stop）和受击动画五种。

![GA_HitReaction_Enemy_Melee Tag 配置（Ability Tags / Activation Required Tag：Event.Character.BeingHit.Melee）](/images/docs/echo-quest/ch3-hit-feedback/ga-hit-reaction-tags.png)

![敌人受击反应蓝图（相机震动 + 音效 + 慢镜头 + Hit Stop + 受击蒙太奇五种打击感节点链）](/images/docs/echo-quest/ch3-hit-feedback/enemy-hit-reaction.png)

---

## 4. 角色动画系统（Lyra 动画蓝图 + 程序化动画修正）

### 4.1 技术选型分析：为什么要用 Lyra 架构，而不用 ALS 或 Motion Matching？

选择 Lyra（Distance Matching）的动画方案，是在确保运行性能、考虑开发维护成本与动作类玩法下精确控制三者间取得的最佳平衡点。

**为什么不用 ALS**：ALS 通过极其复杂的蓝图数学运算来模拟惯性和倾斜，达到了很高的拟真度表现，这些逻辑主要运行在游戏主线程（Game Thread），大幅增加 CPU 开销；同时 ALS 采用单体式架构，所有状态紧密耦合在一个巨大的状态机中，扩展难度呈指数级上升，也不适配本项目复杂的 GAS 技能系统。

**为什么不用 Motion Matching**：Motion Matching 高度依赖高质量的动捕数据，不适合个人项目使用；以及 Motion Matching 本质上是模糊搜索，其动作过渡具有一定的不可预测性。本项目属于强动作类，强调响应速度和精准的攻击判定。Lyra 的状态机方案提供了更强的确定性控制，确保连招和闪避的手感永远是精确且可稳定复现。

### 4.2 Lyra 动画架构的核心技术优势

**线程安全的动画更新**：传统动画蓝图通常在 Event Graph 中处理大量逻辑（如计算速度、方向、倾斜角），这会导致逻辑在游戏主线程运行，影响 CPU 性能。Lyra 架构采用 Thread Safe Update Animation 流程，将数据获取与逻辑运算剥离至工作线程 (Worker Threads) 并行执行，利用 UE5 的属性访问系统，直接从 C++ 层（如 CharacterMovementComponent）高效获取数据，并缓存为原生 Float/Bool，为复杂的动画解算提供极高效率的数据支撑的同时不再占用主线程资源。

**分层动画接口 (Linked Anim Layers)**：为了解决传统单体动画蓝图高耦合问题，Lyra 引入了 Anim Layer Interface，实现了逻辑与表现的分离。主动画蓝图仅作为状态机框架，具体的动作逻辑被拆分为独立的 Layer，如 Locomotion Layer（基础移动）和 Item Layer（对应不同的武器/道具）。当需要扩展新武器时，只需动态链接对应的 Item Layer 资产而无需修改基础逻辑。这种模块化设计极大降低了维护成本。

![Thread Safe Update Animation 函数总览（多个 Setup/Update 函数入口连线）](/images/docs/echo-quest/ch4-animation/thread-safe-update-overview.png)

### 4.3 以主角动画为例，说明 Lyra 架构与程序化动画修正在项目中的实现

以主角动画蓝图 ABP_CyberSkaterBase 为例，我将整个动画流程拆解为数据驱动层、图层架构层与表现执行层三个部分：

#### 4.3.1 线程安全的数据驱动 - Thread Safe Update Animation

传统的动画蓝图在 Event Graph 中每帧 Tick 执行大量逻辑，极易造成主线程性能瓶颈；在 Lyra 架构中，改用 BlueprintThreadSafeUpdateAnimation 函数接管数据更新（位于主动画蓝图中）。利用 UE5 的 Property Access（属性访问）系统，直接从工作线程访问 CharacterMovementComponent，提取旋转、速度 (Velocity)、加速度 (Acceleration) 及角色状态等数据（下文会分类解释每个函数的作用），并将它们缓存为原生 Float 或 Bool。

这样做的好处：将繁重的动画解算逻辑从游戏主线程剥离，降低 CPU 性能开销，确保极端情况下的帧率稳定性。

![Property Access 节点连线（GetCharacterMovement / GetMovementComponent 等线程安全属性读取）](/images/docs/echo-quest/ch4-animation/property-access-nodes.png)

![ALI AnimLayerInterface 接口定义（Idle / Start / Cycle / Stop / Pivot / Jump / Fall 状态插槽声明）](/images/docs/echo-quest/ch4-animation/anim-layer-interface.png)

**1.1 基础物理数据更新：**

- **Update Velocity（更新速度）**：从 CharacterMovementComponent 获取角色的世界空间速度向量（注意 Property Access 节点），并计算 Ground Speed（地面速度）。这是驱动动画状态机的核心数据。它决定了角色状态 (Idle / Moving)，同时 Ground Speed 直接驱动了 Distance Matching 的播放速率，确保步伐与移动速度匹配。

- **Update Acceleration（更新加速度）**：获取角色的当前输入加速度（Input Acceleration），也就是玩家的操作输入。在角色速度还没提起来的瞬间（起步阶段），动画系统须依靠加速度来预判玩家想往哪走，从而立刻播放正确的起步动画。

- **Update Rotation（更新旋转）**：获取角色的世界旋转 (Actor Rotation)，用于计算角色面朝向与玩家视角的偏差。

![ABP_CyberSkaterBase AnimGraph 主蓝图逻辑管线（Locomotion SM → Inertialization → Slot → Control Rig → Output Pose）](/images/docs/echo-quest/ch4-animation/animgraph-pipeline.png)

**1.2 方向与位移解算：**

- **Update Locomotion（更新位移参数）**：计算并缓存角色在帧与帧之间的实际位移量 (DisplacementSinceLastUpdate) 和基于位移的实际速度 (DisplacementSpeed)，作为 Distance Matching 的核心输入源。它确保动画的播放进度是根据实际运动距离驱动，而不是简单的时间，从而在底层物理层面彻底消除滑步现象。

- **Update Cardinal Direction from Velocity（基于速度更新基本方向）**：将 360 度的连续移动方向，量化为 4 个枚举值：F（前），B（后），L（左），R（右），主要用于急停动画的选择。当玩家瞬间取消方向输入时，系统根据当前的速度方向决定急停动画方向。

- **Update Cardinal Direction from Acceleration（基于加速度更新基本方向）**：将玩家的输入意图量化为 4 个离散方向，主要用于 Start（起步）和 Pivot（折返）动画的选择。如当速度向前但加速度突然向后时，系统会识别出这是折返跑操作，从而触发 Pivot 动画。

- **Update Is Moving Perpendicular to Initial Pivot（更新垂直切向运动状态）**：用于检测玩家是否在进行直角拐弯或者复杂的混合输入（如从按住 W 变成突然按住 D），用来优化 Pivot（折返）的手感，确保在复杂走位下的动作过渡平滑流畅。

![Locomotion State Machine 总览（地面循环：Idle / Start / Cycle / Stop / Pivot）](/images/docs/echo-quest/ch4-animation/locomotion-state-machine.png)

![地面循环状态详图 — Cycle / Start / Stop / Pivot 节点与过渡条件连线](/images/docs/echo-quest/ch4-animation/ground-loop-states.png)

**1.3 状态与环境感知：**

- **Update Character State Data（更新角色状态数据）**：从移动组件中读取当前的移动模式，并将其转换为动画系统专用的 Bool 状态。这是主状态机进行 Locomotion / Jump 状态切换的根本依据。

- **Update Jump Fall Data（更新跳跃与滞空数据）**：用于计算并设置 JumpApexTime（跳跃顶点时间戳），也就是角色在跳跃过程中，垂直速度（Z 轴速度）从正数变为负数（开始下落）的那一瞬间的时间，也就是角色到达最高点 (Apex) 的时间点。通过计算 `CurrentTime - JumpApexTime`，得到 TimeFromApex（下落持续时间），来驱动下落时 (Fall Loop) 的动画混合，并辅助落地预判逻辑的计算。

![ABP_ItemLayerBase Setup/Update 函数一览（SetupStartAnim / UpdateStartAnim / SetupStopAnim / UpdateStopAnim / SetupPivotAnim / UpdatePivotAnim 等双函数对）](/images/docs/echo-quest/ch4-animation/item-layer-base.png)

#### 4.3.2 分层动画接口 - Linked Anim Layers

为了解决传统动画蓝图的高耦合问题，Lyra 引入了 Linked Anim Layers，实现了逻辑容器与具体表现的分离，这样做主要有模块解耦和高扩展性两个好处。

ABP_CyberSkaterBase 的 AnimGraph 本质上是一个分层状态机，它并不直接包含动作序列，而是通过 Linked Anim Layer 节点调用子图层。

**2.1 动画图层接口定义 - Anim Layer Interface：**

为实现逻辑与表现的解耦，首先要定义 Anim Layer Interface（动画图层接口）。在项目中，ALI 不是简单的上下半身分层，而是采用了更符合动作游戏需求的"基于状态的细粒度分层 (State-Based Layering)"模式。

- **模板规范**：在 ALI AnimLayerInterface 中定义了动画系统的标准插槽，这些插槽本质上是一种"模板"和"规范"，它们不包含具体动画资源，而是定义各个子蓝图里有哪些状态插槽 (State Slots)，并通过主蓝图对这些状态的逻辑声明实现动态调用。

- **具体插槽定义**：接口涵盖了完整的运动周期，确保了对动作混合的精确控制。包括：
  - 地面运动：Idle（待机）、Start（起步）、Cycle（跑动循环）、Stop（急停）、Pivot（折返）
  - 空中运动：Jump Start（起跳爆发）、Jump Start Loop（起跳上升循环）、Jump Apex（跳跃顶点重力反转瞬间）、Fall Loop（下落循环）、Fall Land（下落接地）、DodgeFallToIdle（空中闪避后的落地缓冲/恢复）

- **动态调用机制**：主动画蓝图 (ABP_CyberSkaterBase) 负责维护核心状态机的跳转逻辑（判断应该在满足什么条件时切换到什么状态），而具体动画数据则通过接口委托给子蓝图 (Linked Anim Layers) 中执行（播对应子蓝图中的对应动作），从而实现逻辑判断与动作资源的解耦。

![UpdateStopAnim 蓝图 — Predict Ground Movement Stop Location → Distance Match to Target 核心节点链](/images/docs/echo-quest/ch4-animation/update-stop-anim.png)

**2.2 主蓝图逻辑管线 - ABP_CyberSkaterBase (AnimGraph)：**

在 ABP_CyberSkaterBase 的 AnimGraph 中，我搭建了一条标准化的 Pose 处理流水线：

Locomotion State Machine（见下文）→ Inertialization（惯性插值，Lyra 架构的关键节点，负责所有状态间的平滑过渡，允许状态机在极短时间内完成姿态突变，保持视觉的连续性）→ Slot DefaultSlot（蒙太奇插槽）→ Control Rig（程序化 IK，见下文，在 IsFalling = False 时启用，防止双腿在空中出现拉伸）。

![Pivot A / Pivot B 图层蓝图实现（Sequence Evaluator → Local To Component → Orientation Warping → Stride Warping → Component To Local → Output）](/images/docs/echo-quest/ch4-animation/pivot-layer.png)

**2.3 核心实现：移动层状态机 - Locomotion State Machine：**

Locomotion State Machine 负责处理各个状态的具体切换逻辑，它利用 Conduit（导管/通路节点）和 State Alias（状态别名）构建了一个高响应度的复杂逻辑网。我们可以将整个状态机拆分为地面、空中与落地决策三个模块。

![Locomotion State Machine 完整全图 — 地面、空中、落地三大模块：JumpSources → JumpSelector → JumpApex → FallLoop → EndInAir → FallLand → DodgeFallToIdle](/images/docs/echo-quest/ch4-animation/locomotion-state-machine-complete.png)

**地面循环**（图左侧）：这是角色最基础的移动闭环，完全由 Distance Matching 驱动。

- **Idle（待机）**：状态机的核心原点；

- **Start（起步）**：当检测到有速度和加速度时进入，同时在没有加速度时进入 Stop（停步），在播放完成后进入 Cycle（跑动循环）；

- **Cycle（跑动循环）**：循环动画，角色的跑动循环，在没有加速度时进入 Stop（停步）；

- **Stop（停步）**：角色急停动画，使用 Distance Matching 进行停下来位置预测，并播放对应的急停动画（决定左脚停还是右脚停）。播放完成后会返回 Idle 状态；若在播放期间检测到有速度和加速度，则会跳转到 Start 状态重新起步；

- **Pivot（折返）**：用于处理角色急剧改变移动方向时的物理惯性表现。当速度与加速度的点乘小于 0 时（即速度向量与加速度向量夹角大于 90 度，呈反向趋势）时，从 Start 或 Cycle 状态（PivotSources）进入 Pivot 状态。Pivot 状态可被打断：当没有加速度时会打断并进入 Stop 状态，当动画中配置的 ANS_ToLocomotion（AnimNotifyState）激活时，或通过监测 IsMovingPerpendicularToInitialPivot 为 True 时（即玩家在折返过程中突然输入了侧向指令，如从前到后过程中突然按了右），会混合回 Cycle 循环。

**空中循环**（中间部分）：这里负责处理角色的跳跃部分。为了实现更细腻且便于后期扩展的跳跃手感与高度，将起跳至落地后的过程拆分为了五个 State。

- **JumpSources（别名）**：统一管理所有进入跳跃状态的条件，包括 Idle、Start、Cycle、Stop、Pivot、DodgeFallToIdle；

- **JumpSelector（选择器）**：一个 Conduit 节点（逻辑选择），根据当前的角色状态决定进入哪一个 State。如果 IsJumping = True（角色 Z 轴速度大于 0）时会进入 JumpStart，如果 IsFalling = True（角色 Z 轴速度小于 0）则会进入 JumpApex；

- **JumpStart & JumpStartLoop**：负责起跳后的上升阶段，分别是蹬地起跳动作和上升阶段的循环；

- **JumpApex（跳跃顶点）**：这是一个很短的过渡状态，用于表现重力反转时的失重感，从细节上提升了跳跃的真实感。判断方式是通过 `-Vz / g` 计算到达零速度的剩余时间，即"当前垂直速度按重力减速，还需要多久归零"，得到 JumpApexTime（Float），当这个值小于 0.4 秒（提前量设计，为动画混合预留时间）时进入这个 State；

- **FallLoop**：空中下落动画循环；

- **FallLand（落地接地）**：落地接地卸力动画，当角色距离地面的距离 GroundDistance 小于 200 时进入，并在播放结束且角色 IsOnGround = True 时退出，进入 EndInAir (Conduit)。

**落地决策与特殊状态**（图右侧）：这里负责处理角色落地一瞬间及落地后的状态选择，通过 EndInAir (Conduit) 进行分流决策：

- **EndInAir（落地选择器）**：当 IsOnGround = True 时，通过 FallLand 或 EndInAirSources（包含 JumpStart、JumpStartLoop、JumpApex、FallLoop、FallLand）进入，并根据条件决定接下来进入哪个状态；

- **CycleAlias**：即 Cycle 状态，当 IsOnGround = True 且角色有速度与加速度时进入，返回地面 Cycle 状态；

- **IdleAlias**：即 Idle 状态，当 IsOnGround = True 且角色没有任何速度与加速度时进入，返回地面 Idle 状态；

- **DodgeFallToIdle（空中闪避后的落地）**：这是本项目为了处理高动量落地情况而设计的特有状态，旨在通过视觉表现消除空中闪避落地后的物理惯性。当角色落地时，若系统检测到角色仍保留着闪避带来的巨大水平动量（有速度）但玩家并未输入任何移动指令时（无加速度），为了避免直接进入普通 Land 状态导致角色出现溜冰一样的平移滑步，会进入该状态，触发急停滑步动画。通过利用动画本身的位移自然匹配残余动量，从而实现从激烈的动态平滑过渡回静态 Idle 的效果。该状态具备高响应性，若在播放期间检测到新的加速度输入，将立即打断并进入 Cycle 状态，否则会在动画结束后自动返回 Idle 状态。

#### 4.3.3 扩展实现与程序化修正：逻辑驱动层 - ABP_ItemLayerBase

ABP_ItemLayerBase 是动画系统中的核心逻辑基类，它利用面向对象的继承特性，封装了所有与程序化修正相关的底层算法。

该类包含了一系列 Setup 和 Update 函数，这些函数直接绑定在状态机内部的 SequenceEvaluator 节点上，实现了对动画播放进度的精确物理控制。

- **Setup 函数**：绑定于状态机的 Entry 节点，它根据当前的角色状态（如速度方向）选择正确的动画资产（Sequence），并将 SequenceEvaluator 的显式时间重置为初始值（一般情况下为 0.0），为后续的计算做好准备。

- **Update 函数**：绑定于状态机的 Update 节点，负责实时驱动。它在每一帧计算角色实际的物理位移或预测目标点，通过数学算法算出当前动画应该播放到哪一帧（Explicit Time），从而强制动画进度与世界的物理移动距离同步。

通过 Setup 的零点重置和 Update 的实时预测，ABP_ItemLayerBase 实现了"物理决定位移，位移驱动动画"的闭环。无论地面摩擦力如何变化，这套逻辑都能保证角色的脚底不会出现滑动，实现了高精度的运动表现。

![ABP_ItemLayerBase 17 个可覆写函数完整列表（SetupStartAnim / UpdateStartAnim / GetMainABPThreadSafe / UpdateCycleAnim / SetupStopAnim / UpdateStopAnim / GetMovementComponent / SetupPivotAnim / UpdatePivotAnim / SetupFallLandAnim / UpdateFallLandAnim...）](/images/docs/echo-quest/ch4-animation/item-layer-functions.png)

**案例解析：急停（Stop）逻辑的具体实现 + Distance Matching：**

以急停（Stop）状态（UpdateStopAnim 函数）为例，这是 Distance Matching 最典型的应用场景。为解决玩家松开键盘后角色向前滑行距离与动画停步距离不匹配的滑步问题，我在这里实现了基于物理预测的距离匹配。

**状态初始化 Setup StopAnim 函数**：当状态机检测到角色速度降为 0 或停止输入时，系统自动调用 Setup StopAnim 函数，该函数执行了两个关键步骤：首先先将当前的动画节点强制转换为 SequenceEvaluator，即取消自动播放动画，由代码接管动画播放的进度；接下来重置时间（Set Explicit Time），将动画播放进度强制重置为 0.0 秒，确保每一次急停动作都从动画的第一帧开始播放，为后续的距离计算提供一个确定的 T=0，Distance = 0 的起始参照点。

![SetupStopAnim 蓝图 — Convert to Sequence Evaluator → Set Explicit Time 0.0，强制重置动画播放进度](/images/docs/echo-quest/ch4-animation/setup-stop-anim.png)

**实时帧驱动 Update 函数**：初始化完成后，系统在每一帧调用 Update StopAnim 函数，利用 Distance Matching 实时修正动画进度。逻辑流程如下：

1. **物理预测（Predict Ground Movement Stop Location）**：核心节点是 Predict Ground Movement Stop Location。该节点通过读取 CharacterMovementComponent 中的物理参数（如当前速度、摩擦力 Friction、刹车减速度 BrakingDeceleration）等，利用物理公式算出按照当前的地面摩擦力，角色自然滑行停止的最终位置。

2. **距离计算（Stop Location）**：计算当前角色位置与预测停止位置间的距离，得出 Stop Location（距离目标的剩余距离），并每帧更新。

3. **距离匹配（Distance Matching）**：数据最终会传入 Distance Match to Target 节点，该节点会查询急停动画中的根节点位移的距离曲线（Distance Curve），并将传入的距离与距离曲线中对应距离的动画帧匹配，以确定从哪帧开始播放动画。

   > `AnimExplicitTime = DistanceCurve.Evaluate(PredictedStopDistance)`
   >
   > 例：如果物理计算显示角色还需要滑行 1.5 米才能停下，该节点就会强制将动画跳转到距离动画结束还有 1.5 米的那一帧。

4. **边界处理（Branch）**：两个 Branch 节点提供了保护机制，如果不需要距离匹配，或物理预测失败（如停步距离不存在或极短），则会自动回退到 Advance Time（普通时间推进节点），防止动画卡死，确保持续的视觉反馈。

![Distance Matching 急停实现完整蓝图（含中文注释）— 物理预测 → 距离计算 → 距离匹配 → 边界 Branch 保护](/images/docs/echo-quest/ch4-animation/distance-matching-stop.png)

**图层实现的模块化封装 + Orientation Warping / Stride Warping：**

如果说上面的 Setup 和 Update 函数决定了进入每个 State 后执行的逻辑算法，急停案例说明了这些算法的执行原理，那么本节则阐述了这些逻辑的"执行容器"是如何构建的。

我将 4.3.2 接口 (ALI) 中的每一个标准插槽（如 Full Body Start、Full Body Pivot）都实例化为了一个独立的动画图层（Animation Layer）。这种"状态即图层"的设计模式实现了逻辑的原子化封装——每个动作状态都是一个独立且流程逻辑完善的独立单元。

以 Pivot A（折返）图层为例，一个标准的图层实现包含 Sequence Evaluator 和最终的 Output 节点，并在此基础上可以添加程序化变形环节。下面来解释每个节点的具体作用：

![Animation Layers 结构 — Default Shared Group 展开，Full Body Idle / Start / Cycle / Stop / Pivot / Jump / Fall 完整状态插槽](/images/docs/echo-quest/ch4-animation/anim-layers-structure.png)

- **节点绑定 Sequence Evaluator**：这里是连接上述 Setup/Update 函数与图层的桥梁。通过 Sequence Evaluator 节点，在状态机进入这个图层时（On Become Relevant），图表内的动画节点就会自动调用执行基类中的 SetupPivotAnim 节点；持续在这个图层中更新时（On Update），则会持续调用 UpdatePivotAnim 函数。

- **空间转换 Local To Component / Component To Local**：由于后续的 Warping 节点需要在组件空间（Component Space）下进行骨骼运算，所以在流程中需要经过 Local To Component 和 Component To Local 的转换。

- **方向扭曲 Orientation Warping**：通过读取 Locomotion Angle，保持角色下半身按照 Pivot 动画运动，但会强制扭转脊柱（Spine）骨骼，使角色上半身朝向始终面向玩家的实际输入方向。

- **步幅扭曲 Stride Warping**：通过读取 Locomotion Speed，在角色折返时动态拉伸/压缩双腿跨出的距离，以匹配胶囊体的实际移动速度，彻底消除滑步。

![Stride & Orientation Warping 图层流水线（Sequence Evaluator → Local To Component → Orientation Warping → Stride Warping → Component To Local → Output Pose）](/images/docs/echo-quest/ch4-animation/stride-warping-pipeline.png)

值得注意的是，图层内部不仅可以是单一的动画节点，也可以是更细分的子状态机。如 Pivot_State 中包含一个微型状态机，用于处理 Pivot A（左折返）与 Pivot B（右折返）的选择逻辑。这里也是 Lyra 分层架构宏观状态机控制流程、微观图层处理细节优势的体现。

#### 4.3.4 资产配置与具体实现：装配层 - ABP_LocomotionLayers

如果说 4.3.3 中的 ABP_ItemLayerBase 构建了结构和逻辑，那么这里的 ABP_LocomotionLayers 就对应了每条结构需要实际执行的动画。作为 ABP_ItemLayerBase 的具体子类，这个蓝图展现了 Lyra 架构中逻辑与资源彻底解耦的终极形态：零逻辑，纯数据。

这个蓝图的唯一职责就是通过变量覆写（Asset Override）的方式，将具体的动画序列（Anim Sequence）注入到父类预留的插槽中。一旦这些变量被赋值，父类的 Setup/Update 函数在运行时就会自动读取这些具体的动画资源，并应用到对应的 Sequence Evaluator 上。

![ABP_LocomotionLayers Edit Defaults — 各状态插槽（Idle / Cycle / Start / Jog / JumpApex / FallLoop / FallLand / DodgeFallToIdle）指定具体动画序列资产](/images/docs/echo-quest/ch4-animation/locomotion-layers.png)

这样做的优势在于将逻辑层和表现层完全解耦。动画或策划在配置时，无论如何修改表现层内容，都不会破坏底层的状态机逻辑或算法。同时，这套架构有很强的复用性与扩展度，如果我想做多人游戏中的另一个角色、或者当前角色拿着另一种武器、或是受伤状态下的主角状态，只需创建一个新的子蓝图继承 ABP_ItemLayerBase，再替换掉里面的动画资产即可。一套逻辑可以驱动无数种完全不同风格的动作表现。

### 4.4 程序化物理修正 - Control Rig Foot IK

在动画管线的末端，我引入了 Control Rig 来处理 Foot IK（足部反向动力学）。这是实现角色与环境（斜坡、楼梯、障碍物）真实交互的关键。

#### 4.4.1 技术选型分析：为什么要用 Control Rig，而不用传统 IK？

在 UE4 时代，通常直接在 AnimGraph 中使用 Two Bone IK 节点配合复杂的蓝图射线检测逻辑。在本项目中，我全面转向了 Control Rig，主要基于以下优势：

- **逻辑可视化与封装**：传统方式下射线检测逻辑写在 CharacterBP 里，动画修正写在 AnimBP，逻辑分散且难以调试。在 Control Rig 中，所有射线检测、数学计算、骨骼变换逻辑都封装在 CR_CyberSkater_Mage_BasicFootIK 中，我们可以直接在其中看到逻辑和 Debug Flow，所见即所得。

- **更自然的全身解算（Full Body IK Integration）**：传统方式的 Two Bone IK 只能简单地折叠膝盖，容易导致骨骼的僵硬和不自然弯曲。Control Rig 则使用了 Full Body IK (FBIK) 求解器。当脚抬高时，它不仅会弯曲膝盖，还会自然地调整骨盆高度甚至脊柱姿态，实现全身联动的自然姿态输出。

- **零开销混合**：如 AnimGraph 所示，我通过 ShouldDoIKTrace 变量控制整个 Rig 的开关。当角色在空中时，IK 逻辑完全停止，减少了性能消耗。

![AnimGraph 末端 Control Rig 节点 — IsFalling NOT 条件控制 IK 开关，IsFalling 时 Control Rig 短路跳过](/images/docs/echo-quest/ch4-animation/animgraph-control-rig.png)

#### 4.4.2 核心实现逻辑

在 Control Rig 中，严格遵循检测 → 平滑 → 偏移 → 求解的标准流水线，分为 5 个步骤：

![Control Rig Foot IK Step 1-3 — 球形射线检测（双脚 ZOffset 计算）→ AlphaInterpolate 平滑 → 骨盆高度适配](/images/docs/echo-quest/ch4-animation/control-rig-foot-ik-steps1-3.png)

- **Step 1 - 环境感知**：首先判断 ShouldDoIKTrace 是否开启。若开启，从双脚位置向下发射球形射线，获取双脚正下方的地面高度并计算脚底与实际地面的高度差（ZOffsetTarget），即"脚悬空了多少"或"脚陷进去多少"。

- **Step 2 - 信号平滑**：射线检测的数据是瞬变的（如瞬间跨过一个台阶时，如果直接应用，脚会瞬间"瞬移"到台阶上），在这一步中通过插值节点 (AlphaInterpolate) 让数值平滑过渡，避免鬼畜抖动。

- **Step 3 - 骨盆适配**：对比左右脚的 Offset 并取最低值，来调整骨盆 (Pelvis) 的高度 (ZOffset_Pelvis)。

- **Step 4 - 应用偏移**：通过将计算好的 Z Offset 传入到 Modify Transform 节点，应用到虚拟的 IK 骨骼（ik_foot_l、ik_foot_r）和骨盆上。这时会将 IK 的目标点贴合地面，但真正的腿骨还没动。

- **Step 5 - 全身求解**：最后，调用 Full Body IK 节点，将 Step 4 中移动到位的 ik_foot 骨骼作为 Effectors（效应器），FBIK 求解器会自动计算大腿、小腿、脚踝的旋转角度，使其自然地通过骨骼链传递到这些目标点。

![Control Rig Foot IK Step 4-5 — Modify Transform（ik_foot_l / ik_foot_r / Pelvis Z 偏移应用）→ Full Body IK 求解器（Effector 驱动全腿骨骼链）](/images/docs/echo-quest/ch4-animation/control-rig-foot-ik-steps4-5.png)

---

## 5. Motion Warping

### 5.1 什么是 Motion Warping？

Motion Warping 是 UE5 的一项新功能，是一套用于动态修改根骨骼运动 (Root Motion) 的程序化动画系统。它允许我们将一段固定位移的动画扭曲 (Warp) 到游戏世界中的任意目标位置与朝向。能做到在不改变动画播放时长和动作姿态的前提下，动态拉伸或压缩角色的位移轨迹，以适配角色的实际运动。

- **根骨骼接管**：Motion Warping 的本质是对 Root Motion（根骨骼运动）的实时数学修正。它不会改变手脚的 IK (Control Rig)，而是直接作用于角色的胶囊体。工作原理是计算当前位置与目标位置 (Warp Target) 的差值，并将这个差值平滑地分配到动画的每一帧中。

- **基于时间窗口的控制**：Motion Warping 通过 Anim Notify State（动画通知状态）来定义一个生效窗口，只有在动画播放到这段窗口时（比如挥剑动作的起手到击中瞬间）扭曲才会生效。这确保了角色在不需要吸附的时候（比如攻击后摇阶段）保持自然的物理运动。

如果说 Control Rig 是为了让脚适应地面、手去摸指定点的微观修正，那 Motion Warping 就是为了让身体适应目标的宏观位移。它解决了动作游戏中经典的攻击滑步和打不到人的问题，实现了角色与交互目标的精准对齐。

### 5.2 为什么要用 Motion Warping？

**设计维度**：项目定位为高速动作游戏，战斗系统的核心体验在于流畅的爽感，因此确认了弱空间维度、强时间维度的设计。通过 Motion Warping 配合自动索敌，只要玩家在合理范围内按下攻击键，角色就会自动通过位移修正，实现自动攻击吸附，大幅弱化空间维度的考验。而对玩家的挑战，主要在于发起战斗与闪避的时机，也就是时间维度。

**传统技术问题**：在 Motion Warping 普及前实现类似的吸附效果，主要通过使用 VInterpTo 或 MoveComponentTo 强行拉动角色位置，这会导致角色攻击滑步的出现，破坏视觉真实感；或者通过大量的动画资源弥补，这样做成本极高且容易出现混合问题。

**Motion Warping 优势**：

- **脚步自适应**：Motion Warping 会程序化地拉伸根骨骼曲线，配合 Stride Warping（见 4.3.3），角色的脚步跨度会随之变大；反之则变小。
- **动态追踪**：它可以实时追踪移动中的目标，即便敌人在攻击前摇期间移动了，Warping 也能动态更新落点，确保攻击命中。
- **资源复用**：只需要一个标准的攻击动作，可以适配大部分的攻击情境，降低美术资源的压力。

### 5.3 以近战攻击吸附为例，说明 Motion Warping 在项目中的实现

![BP_MainPlayer Components 面板 — MotionWarping 组件与 ComboGraphCollision、GAS 核心组件并列挂载](/images/docs/echo-quest/ch5-motion-warping/motion-warping-component.png)

![PIE 运行时攻击吸附效果 — 玩家自动向目标位移对齐并发动攻击（+MANA! 回蓝反馈）](/images/docs/echo-quest/ch5-motion-warping/motion-warping-ingame.png)

#### 5.3.1 目标数据的构建 - LightAttackMotionWarping 函数

LightAttackWarping 函数位于角色主蓝图 BP_MainPlayer 中，用于计算轻攻击 Motion Warping 的吸附落点。

Motion Warping 不负责计算敌人是谁，所以在逻辑开始时需要获取近战攻击索敌章节中提到的 Target Actor，并通过 Is Valid 节点判断其是否存在。这里分为两种情况：

![LightAttackMotionWarping 函数蓝图（落点计算：Find Look at Rotation + Attack Point Distance 修正）](/images/docs/echo-quest/ch5-motion-warping/motion-warping-function.png)

**A. 存在目标时，计算落点**：这里的逻辑是计算一个"最佳攻击位置"（吸附目标点），而不是直接飞到敌人身体里造成穿模。

- **朝向计算**：通过 Find Look at Rotation 计算自身到目标的旋转角度。这确保角色发动攻击时会强制面朝敌人。
- **位置计算**：吸附位置 = 目标位置 + （朝向向量 × 攻击距离修正值）。首先获取角色朝向敌人的 Forward Vector，乘以 Attack Point Distance（通常为负数，项目中为 -150），会得到一个从敌人位置指向玩家的向量。通过将这个向量加到敌人坐标上，就得到了敌人身前 150cm 处的点位。
- 这确保角色会吸附到敌人的正前方攻击范围内，并预留出武器挥砍的空间（即 Attack Point Distance）。
- **提交数据**：调用 Motion Warping 的核心节点 Add or Update Warp Target from Location and Rotation，并将 Warp Target Name 设置为 `AttackWarping`。在后续的动画蒙太奇配置中，Motion Warping 系统会根据相同的名字找到 Warp 的目标。

**B. 无目标时的移除**：当不存在 Target Actor 时，清理 AttackWarping 的数据。

通过调用 Remove Warp Target，立即清除 AttackWarping 的目标数据。这防止系统意外使用上次攻击的残留数据，导致在没有索敌目标时，角色飞向刚才被攻击且已死掉的敌人位置。

![Reset Warp Target 函数蓝图 — Remove Warp Target 节点清除 AttackWarping 目标数据](/images/docs/echo-quest/ch5-motion-warping/reset-warp-target.png)

#### 5.3.2 逻辑触发与生命周期 - ANS_AttackMotionWarping_Light <!-- 注：项目中实际文件名为 ANS_AttackMotionWapring_Light（拼写偏差） -->

为实现对吸附时机的精准控制，我创建了一个自定义的动画通知状态（Anim Notify State），负责管理 Motion Warping 的生命周期，确保数据在需要时会通过调用保持最新，在结束时被清理。

![ANS_AttackMotionWapring_Heavy / _Light — 轻重攻击各自对应一个自定义 ANS Blueprint Class](/images/docs/echo-quest/ch5-motion-warping/ans-assets.png)

**激活瞬间：实时数据刷新（Received Notify Begin）**

当动画播放进入该通知状态的起始帧时，读取当前锁定的 Target Enemy，并调用 Light Attack Motion Warping 函数更新 Warping 吸附位置。

在这里调用是为了解决时间差问题——敌人可能在攻击动画的前摇期进行过移动，如果在 Notify Begin 时重新计算吸附落点，就能确保角色是朝着敌人当前的最新位置吸附，极大提升了命中的准确性。

![ANS Received Notify Begin 蓝图 — Get Owner → Cast To BP_MainPlayer → Light Attack Motion Warping（传入 Target Enemy）](/images/docs/echo-quest/ch5-motion-warping/ans-notify-begin.png)

**结束瞬间：状态清理与重置（Received Notify End）**

当动画播放离开该通知状态范围时，Received Notify End 被触发，并调用 Reset Warp Target 函数。

通过 Reset Warp Target 函数，攻击段动作结束后，会立即解除锁定，同时会重置下一连段 Motion Warping 的目标数据。显式调用 Reset 保证了每次攻击的独立性和安全性。

![ANS Received Notify End 蓝图 — Get Owner → Cast To BP_MainPlayer → Reset Warp Target](/images/docs/echo-quest/ch5-motion-warping/ans-notify-end.png)

#### 5.3.3 动画蒙太奇配置与轨道协同

在动画蒙太奇中进行实际配置是实现 Motion Warping 的最后一步，也是将逻辑与视觉表现结合的环节。这一步主要通过在蒙太奇的通知轨道中添加特定的通知状态来定义扭曲发生的精确时间窗口。

![动画蒙太奇双轨配置 — MotionWarping 内置通知（轨道 3）+ ANS_AttackMotionWarping 自定义通知（轨道 4）](/images/docs/echo-quest/ch5-motion-warping/montage-warping-tracks.png)

**内置运动扭曲通知（轨道 3：MotionWarping）**

轨道 3 使用的是引擎内置的 MotionWarping 通知状态，它负责驱动实际的根骨骼运动扭曲（Root Motion Modifier）。

在配置部分，其中的 Warp Target Name (`AttackWarping`) 是最关键的设置，必须与第 1 节中在蓝图里设置的目标名称完全一致，它充当了逻辑层与表现层之间的参数密钥。

Root Motion Modifier 选择 Skew Warp（斜切扭曲），这种模式在 Lyra 架构中常用于处理具有平移和旋转复合需求的近战攻击。

![MotionWarping 内置通知状态配置面板（Warp Target Name=AttackWarping，Root Motion Modifier=Skew Warp，Position Time Multiplier=1.2）](/images/docs/echo-quest/ch5-motion-warping/motion-warping-notify-config.png)

**自定义逻辑生命周期（轨道 4：ANS_AttackMotionWarping_Light）**

轨道 4 放置的是第 2 节中编写的自定义通知状态 ANS_AttackMotionWarping_Light。

该通知状态的窗口通常略早于或同步于轨道 3 的位移扭曲窗口，在 Notify Begin 时触发计算函数，并在动画更新期间持续刷新目标的最新坐标。这保证了轨道 3 在执行位移时，其 Warping 位置始终与敌人移动轨迹同步更新，并保持最优预判点。

**双轨协同的优势（逻辑与执行解耦）**：

- **实时与精准**：轨道 4 负责寻找目标并实时刷新坐标，轨道 3 负责平滑地将角色拉向该坐标。这种职责分离的设计让攻击吸附显得既有物理动量感，又极其精准。
- **调试解耦**：通过在蒙太奇中设置这两个通知状态的起止位置，可以非常直观地调整吸附速度和时机，实现了表现调整与逻辑的解耦。

---

## 6. 敌人与 EQS

### 6.1 敌人 AI 架构体系：控制器与基类的模块化解耦

在构建动态且具有扩展性的 AI 系统时，逻辑与表现的分离是工业化开发的核心。项目通过 UE 经典的大脑（Controller）-宿主（Pawn/Character）架构，实现了敌人 AI 逻辑的解耦。这种设计不仅提高了复用性，更为快速迭代奠定了基础。

![AI 系统文件夹结构总览（Content/Enemy 目录：AI/BehaviorTrees、AI/Tasks、AI/Decorators、AI/EQS、AI/Interfaces 层级）](/images/docs/echo-quest/ch6-enemy-ai/ai-folder-structure.png)

- **核心基类**：角色蓝图 BP_Enemy_Base 与控制器 AIC_Enemy_Base 确立了敌人的基本框架。
- **逻辑层**：BehaviorTrees 文件夹中包含了主行为树（BT_Enemy_Melee）与三棵子行为树（SubTree_Frozen、SubTree_Investigating、SubTree_Passive），实现了决策的分层管理。
- **工具层**：Tasks（BTT）与 Decorators（BTD）提供了具体的动作执行和条件判断能力，EQS 提供了空间环境感知能力，三者共同构成了行为树的"子行为"积木。

**总体架构设计：**

在架构设计上，我采用了感知/逻辑/表现解耦的三层结构：

- **AIC_Enemy_Base（感知层）**：作为决策中枢，挂载 AI Perception Component，负责外界信息的采集（视觉 AI Sight、听觉 AI Hearing、伤害 AI Damage）以及行为树的启动与黑板变量的初始化。
- **Behavior Tree & Blackboard（逻辑层）**：黑板（BB_Enemy_Base）负责存储记忆（如 AttackTarget、PointOfInterest、当前 AI 状态等），行为树根据黑板中的状态变量流转决定当前行为。
- **BP_Enemy_Base（表现层）**：负责存储属性（血量、速度）、挂载表现资源（Mesh、动画）、实现 BPI_EnemyAI 接口，以及执行最终的动作指令。

**模块化设计的优势：**

- **极高的逻辑复用性**：AIC_Enemy_Base 作为公用基类，可以复用并驱动不同外观和属性的敌人，也可以在运行时动态更换 Controller 来改变战术风格。
- **原子化功能封装**：通过将 AI 逻辑拆解为独立的 Tasks、Decorators 和 Services，每个逻辑片段（如"寻找巡逻点"、"检查距离"）都成为了可复用的积木块，极大提升了复用性。
- **并行开发效率**：通过逻辑和表现的解耦，实现了逻辑优化（程序）与表现配置（美术）的分离，二者互不干扰。
- **低耦合的接口通信**：利用 BPI_EnemyAI 蓝图接口构建了行为树任务（BTT）与角色类间的通信桥梁。这种基于接口的设计有效消除了不同模块间的硬引用。AI 控制器无需感知具体的角色类类型即可下达指令，在确保系统高扩展性的同时，显著优化了资产加载性能并降低了维护成本。

### 6.2 以近战敌人为例，说明 AI 全流程在项目中的实现

> **敌人 AI 完整数据流**：`感知刺激 → AIC_Enemy_Base (Perception) → 更新黑板 (AttackTarget / State) → BT_Enemy_Melee (决策) → BTT/BTD (执行) → BP_Enemy_Melee (表现)`

#### 6.2.1 资源及表现层：敌人 Pawn 类与资源属性载体（BP_Enemy_Base / Melee）

在 AI 系统的解耦架构中，Pawn 类（角色蓝图）是 AI 的身体，它不负责决策，而是作为资源和属性的载体，负责执行逻辑层的指令并存储表现所需的资源和逻辑。

**BP_Enemy_Base** 确立了所有敌人的底层框架，定义了"什么是敌人"及它们应该具备哪些基础的、共有的能力：

![BP_Enemy_Base Components 面板 — GAS 核心组件、ComboGraphCollision、WidgetComponent 挂载](/images/docs/echo-quest/ch6-enemy-ai/bp-enemy-base-components.png)

- **核心组件**：GAS 核心（确保敌人具备与玩家一致的战斗逻辑底层，共用 Attribute Set 数据表）、UI 与反馈（WB_EnemyHealthBar 实时呈现血量状态）、ComboGraphCollision（处理战斗中的攻击碰撞判定）；
- **接口（Interfaces）**：实现 BPI_EnemyAI 蓝图接口，向 AI Controller 声明自己能够接收指令（如装备武器、设置移动速度、激活 ComboGraph 等），从而实现低耦合的接口通信；
- **变量配置**：预留了 PatrolRoute（巡逻路径引用，关联 BP_PatrolRoute）和 BehaviorTree（行为树资产引用）的变量，支持在关卡编辑器中为不同位置的敌人实例单独配置巡逻路线和行为逻辑。

**BP_Enemy_Melee** 作为 BP_Enemy_Base 的子类，专门负责填充近战敌人特有的资产和视觉表现逻辑：

![BP_Enemy_Melee BeginPlay 初始化流程 — 武器挂载 → ComboGraphCollision 碰撞处理 → 血条 Widget 创建 → 掉落物计算](/images/docs/echo-quest/ch6-enemy-ai/bp-enemy-melee-init.png)

- **初始化流程**：在 BeginPlay 中先后执行武器挂载（BP_EnemyWeapon_DualSword 绑定到手部 Socket）、ComboGraphCollision 碰撞处理、血条 Widget 创建和玩法部分的掉落物概率计算；
- **视觉表现层**：加入了死亡动态溶解效果（DynamicEnemyDissolveMat，通过动态材质实例驱动溶解参数）、生成时随机材质选择（SetSwordMaterial，从预设材质数组中随机赋值），低成本增加敌人视觉多样性并丰富表现；

![PIE 运行时敌人视觉多样性 — 随机材质选择 / 死亡溶解效果](/images/docs/echo-quest/ch6-enemy-ai/enemy-visual-diversity.png)

- **战斗状态管理**：声明了战斗状态变量，包括标记是否已进入战斗状态（用于触发拔刀等一次性逻辑）和 Boss 的特殊逻辑开关。

#### 6.2.2 感知层：感知驱动与外界信息获取（AIC_Enemy_Base）

AIC_Enemy_Base 是所有敌人 AI 的控制器基类，作为 AI 系统的"大脑"，它承担了两个核心职责：**环境感知**与**行为启动**。

**AI Perception Component 配置：**

![AIC_Enemy_Base AI Perception Component — Senses Config：AI Sight / AI Hearing / AI Damage 三种感知类型配置](/images/docs/echo-quest/ch6-enemy-ai/ai-perception-config.png)

控制器挂载了 AI Perception Component，配置了三种感知类型以覆盖不同的战斗场景：

- **AI Sight（视觉感知）**：负责检测视野范围内的玩家。配置了感知半径、视野角度和失去视线后的记忆持续时间。这是敌人从 Passive 状态进入 Attacking 状态的主要触发源；
- **AI Hearing（听觉感知）**：负责检测玩家产生的声音刺激（如攻击音效、脚步声）。当敌人尚未看见玩家但听到声响时，会进入 Investigating 状态前往声源位置调查；
- **AI Damage（伤害感知）**：负责检测来自玩家的伤害事件。即使敌人背对玩家，受到攻击后也会立即感知到威胁源并切换至战斗状态，确保"偷袭"后敌人不会无动于衷。

**感知事件处理 - On Target Perception Updated：**

当任意感知通道检测到刺激源时，系统会触发 On Target Perception Updated 事件回调。在该回调中执行以下逻辑：

![On Target Perception Updated 回调蓝图 — 感知类型 Switch → 黑板 AttackTarget 写入 → State 切换（Attacking / Investigating）](/images/docs/echo-quest/ch6-enemy-ai/on-perception-updated.png)

1. **感知类型判定**：通过 E_AISenses 枚举（None、Sight、Damage）识别本次感知的触发来源，以决定后续的状态切换策略；

2. **黑板变量更新**：将感知到的目标 Actor 写入黑板的 `AttackTarget` 变量中，同时根据感知类型更新 `PointOfInterest`（兴趣点，用于 Investigating 状态的移动目标）；

3. **AI 状态切换**：根据感知类型更新黑板中的 E_AIStates 状态变量：
   - **Sight 感知**：直接将状态设为 `Attacking`，敌人立即进入战斗；
   - **Damage 感知**：将状态设为 `Attacking`，同时将伤害来源设为 AttackTarget；
   - **Hearing 感知**：将状态设为 `Investigating`，敌人前往声源位置调查；
   - **失去感知（Unregister）**：当目标离开感知范围后，根据当前上下文决定是进入 `Investigating`（前往最后已知位置搜索）还是回退到 `Passive`。

**行为树的启动与黑板初始化：**

在 AIC_Enemy_Base 的 On Possess 事件中（即控制器接管 Pawn 的瞬间），执行以下初始化流程：

1. 从 BP_Enemy_Base 中读取预配置的 BehaviorTree 资产引用，调用 Run Behavior Tree 启动行为树；
2. 初始化黑板（BB_Enemy_Base）中的关键变量，包括 `State`（初始为 Passive）、`AttackTarget`（初始为空）、`DefendRadius`（理想攻击距离）、`PatrolRoute`（从 Pawn 上读取的巡逻路径引用）等。

#### 6.2.3 决策层：决策中枢与记忆存储（BT_Enemy_Melee & BB_Enemy_Base）

**黑板 BB_Enemy_Base - 记忆与共享数据：**

黑板是行为树的"短期记忆"，存储了 AI 在运行时需要读写的所有关键数据。项目中的核心黑板变量包括：

| 变量名 | 类型 | 作用 |
|--------|------|------|
| `State` | E_AIStates (Enum) | 当前 AI 状态，驱动行为树顶层分支选择 |
| `AttackTarget` | Object (Actor) | 当前锁定的攻击目标（玩家） |
| `PointOfInterest` | Vector | 兴趣点坐标（调查目标位置/EQS 查询结果） |
| `DefendRadius` | Float | 理想攻击距离，用于判断是否需要接近目标 |
| `PatrolRoute` | Object | 巡逻路径引用，关联 BP_PatrolRoute |

**E_AIStates 状态枚举**：定义了敌人的五种行为状态，分别是 `Passive`（被动巡逻）、`Attacking`（战斗攻击）、`BeingHit`（受击僵硬）、`Investigating`（调查搜索）和 `Dead`（死亡）。该枚举是整个行为树分支选择的根本依据。

![BB_Enemy_Base 黑板变量定义 — State / AttackTarget / PointOfInterest / DefendRadius / PatrolRoute](/images/docs/echo-quest/ch6-enemy-ai/blackboard-variables.png)

**行为树 BT_Enemy_Melee - 决策主干：**

BT_Enemy_Melee 采用顶层 Selector 节点的经典优先级架构，从左到右（优先级从高到低）分为四个核心分支。每个分支通过 Blackboard Decorator 检查 `State` 变量的值来决定是否激活：

```
Root (Selector)
├── [1] BeingHit State（受击僵硬）   ← State == BeingHit  → SubTree_Frozen
├── [2] Combat State（战斗状态）     ← State == Attacking  → 战斗逻辑序列
├── [3] Investigating State（调查）  ← State == Investigating → SubTree_Investigating
└── [4] Passive State（被动巡逻）    ← State == Passive    → SubTree_Passive
```

这种优先级设计确保了：受击反馈拥有最高响应优先级（打断一切行为），战斗逻辑次之，调查行为再次，巡逻为最低优先级的默认行为。

![BT_Enemy_Melee 行为树全览 — 顶层 Selector + BeingHit / Combat / Investigating / Passive 四个分支](/images/docs/echo-quest/ch6-enemy-ai/behavior-tree-overview.png)

**分支 1 - BeingHit State（SubTree_Frozen）：**

当敌人被玩家攻击命中后，GAS 系统会通过 GE_HitReaction_Melee 给敌人添加 `Event.Character.BeingHit.Melee` Tag，触发 GA_HitReaction_Enemy_Melee 播放受击动画。与此同时，感知层将 State 切换为 `BeingHit`，行为树立即跳转至该分支。

SubTree_Frozen 的内部流程：
1. **BTT_RotateToPlayer**：受击瞬间强制旋转敌人面向玩家，确保受击方向的视觉一致性；
2. **BTT_ClearFocus**：清除 AI 的 Focus 锁定，防止在僵硬期间出现不自然的头部追踪；
3. **BTT_SetMovementSpeed（Idle）**：将移动速度设为 0，确保敌人在受击期间不会滑动；
4. **Wait**：等待一段时间（与受击动画时长匹配），模拟受击后的硬直恢复期。

等待结束后，State 被重新设回 `Attacking`，行为树自动回到战斗分支，形成受击 → 硬直 → 恢复战斗的完整闭环。

![SubTree_Frozen 行为子树 — BTT_RotateToPlayer → BTT_ClearFocus → BTT_SetMovementSpeed → Wait](/images/docs/echo-quest/ch6-enemy-ai/subtree-frozen.png)

**分支 2 - Combat State（战斗逻辑序列）：**

这是整个行为树中最复杂的分支，内部进一步拆分为三个子阶段：装备检查、攻击执行和战术走位。

![Combat State 分支详细结构 — 装备检查、攻击执行（BTT_MoveToIdealRange → BTT_ActiveComboGraph）、Strafe 走位三阶段](/images/docs/echo-quest/ch6-enemy-ai/combat-state-branch.png)

**阶段 A - 装备检查**：通过 BTD_IsEnemyHasSwords（Decorator）判断敌人是否已经装备武器。若未装备，则依次执行 BTT_FocusTarget（锁定玩家）和 BTT_EquipWeapon（播放拔刀动画并挂载武器）。该检查仅在首次进入战斗时触发一次。

**阶段 B - 攻击执行**（Sequence）：
1. **BTT_SetMovementSpeed（Run）**：将移动速度设为奔跑，快速接近目标；
2. **BTT_ClearFocus**：临时清除 Focus，避免在奔跑接近时上半身不自然地锁定目标；
3. **BTT_MoveToIdealRange**：使用 Move To 节点驱动敌人向玩家移动，直到进入黑板中 `DefendRadius` 定义的理想攻击距离；
4. **BTT_FocusTarget**：重新锁定玩家，确保攻击时面朝目标；
5. **BTT_ActiveComboGraph**：通过 BPI_EnemyAI 接口调用 BP_Enemy_Melee 上的 ComboGraph 组件，激活 CG_Enemy_Combo（敌人连招资产），执行攻击动画并触发 GAS 伤害逻辑。

![CG_Enemy_Combo 连招资产 — Entry 节点 + 攻击蒙太奇节点 + GE/GC 配置面板](/images/docs/echo-quest/ch6-enemy-ai/enemy-combo-graph.png)

**阶段 C - 战术走位（Strafe Selector）**：攻击完成后，敌人不会傻站原地，而是通过 Strafe 选择器决定下一步的移动策略。该选择器包含两个分支：

- **分支 C-1**：BTD_IsWithinIdealRange 判断为 False（超出理想距离）→ 依次执行 BTT_ClearFocus、BTT_SetMovementSpeed（Run）、BTT_MoveToIdealRange，重新接近玩家；
- **分支 C-2**：在理想距离内 → BTT_FocusTarget（保持面朝玩家）、BTT_SetMovementSpeed（Walk）、Run EQS Query（执行 EQS_Strafe 查询，见 6.3 节）、Move to PointOfInterest（移动到 EQS 返回的最佳走位点），实现围绕玩家的战术游走。

**分支 3 - Investigating State（SubTree_Investigating）：**

当敌人通过 AI Hearing 感知到声音但未直接看到玩家时进入该状态。SubTree_Investigating 的内部流程：

1. **Move to PointOfInterest**：敌人移动至声源的世界坐标（由感知事件写入黑板的 PointOfInterest 变量）；
2. **Wait**：到达后原地等待一段时间，模拟搜索和环顾行为；
3. **BTT_SetStateAsPassive**：若等待期间未触发新的感知事件，则将 State 设回 `Passive`，敌人恢复正常巡逻。

这种设计使敌人具备了"警觉 → 搜索 → 放弃"的拟人化行为链，而非简单的"看到就打，看不到就站"。

![SubTree_Investigating 行为子树 — Move to PointOfInterest → Wait → BTT_SetStateAsPassive](/images/docs/echo-quest/ch6-enemy-ai/subtree-investigating.png)

**分支 4 - Passive State（SubTree_Passive）：**

这是敌人的默认空闲行为。SubTree_Passive 的内部流程：

1. **BTD_HasPatrolRoute（Decorator 判断）**：检查黑板中的 PatrolRoute 变量是否有效；
   - **有巡逻路径**：执行 BTT_MoveAlongPatrolRoute，敌人沿预设的 BP_PatrolRoute 路径点循环移动，营造巡逻氛围；
   - **无巡逻路径**：不执行任何移动，敌人原地 Idle 等待，作为定点守卫。

BP_PatrolRoute 是项目中的巡逻路径数据资产，通过在关卡中放置 Spline 点来定义路径，支持不同敌人绑定不同路线，实现多样化的巡逻模式。

![SubTree_Passive 行为子树 — BTD_HasPatrolRoute → BTT_MoveAlongPatrolRoute；及 BP_PatrolRoute Spline 可视化](/images/docs/echo-quest/ch6-enemy-ai/subtree-passive.png)

![PIE 运行时敌人巡逻效果 — 敌人沿 BP_PatrolRoute 移动（含 AI Debug 行为树状态）](/images/docs/echo-quest/ch6-enemy-ai/subtree-passive-ingame.png)

#### 6.2.4 执行层：任务节点与条件判断（BTT & BTD）

行为树的叶节点由自定义的 BTTask（任务节点）和 BTDecorator（条件装饰器）构成。它们是整个 AI 系统的"原子操作"——每个节点只做一件事，通过组合实现复杂行为。

**自定义任务节点（BTTask）清单：**

| 任务节点 | 职责 | 关键实现 |
|----------|------|----------|
| BTT_FocusTarget | 锁定注视目标 | 调用 AI Controller 的 Set Focus，使敌人持续面朝 AttackTarget |
| BTT_ClearFocus | 清除注视锁定 | 调用 Clear Focus，解除头部/身体的强制追踪 |
| BTT_SetMovementSpeed | 设置移动速度 | 通过 BPI_EnemyAI 接口设置 E_MovementSpeed（Idle/Walk/Run） |
| BTT_MoveToIdealRange | 移动至理想距离 | 使用 Move To 节点接近 AttackTarget，到达 DefendRadius 时完成 |
| BTT_EquipWeapon | 装备武器 | 通过 BPI_EnemyAI 接口触发拔刀蒙太奇，将武器从背部 Socket 切换到手部 Socket |
| BTT_RotateToPlayer | 转向玩家 | 强制旋转 Pawn 朝向 AttackTarget，用于受击瞬间的方向校正 |
| BTT_ActiveComboGraph | 激活攻击连招 | 通过 BPI_EnemyAI 接口激活 CG_Enemy_Combo，执行攻击动画及 GAS 伤害逻辑 |
| BTT_MoveAlongPatrolRoute <!-- 注：项目中实际文件名为 BTT_MoveAlongPartolRoute（拼写偏差） --> | 沿路径巡逻 | 读取 PatrolRoute 中的路径点，依次移动并循环 |
| BTT_SetStateAsPassive | 重置为被动状态 | 将黑板 State 设为 Passive，用于调查超时后的状态回退 |
| BTT_DefaultAttack | 默认攻击（备用） | 简化版攻击逻辑，作为无 ComboGraph 时的回退方案 |

**自定义条件装饰器（BTDecorator）清单：**

| 装饰器节点 | 职责 | 判断逻辑 |
|------------|------|----------|
| BTD_HasPatrolRoute | 是否有巡逻路径 | 检查黑板 PatrolRoute 变量是否有效（非 null） |
| BTD_IsEnemyHasSwords | 是否已装备武器 | 通过 BPI_EnemyAI 接口查询敌人的武器挂载状态 |
| BTD_IsWithinIdealRange | 是否在理想攻击距离内 | 计算敌人与 AttackTarget 的距离，与黑板 DefendRadius 比较 |

这套原子化的任务/装饰器体系的优势在于：每个节点职责单一、接口统一、可独立测试，通过在行为树中的不同组合即可构建出从简单巡逻到复杂战术的各种 AI 行为，无需为每种敌人编写定制逻辑。

![BPI_EnemyAI 蓝图接口定义 — SetMovementSpeed / EquipWeapon / ActiveComboGraph 等函数签名](/images/docs/echo-quest/ch6-enemy-ai/bpi-enemy-ai-interface.png)

![BTT_EquipWeapon 任务节点蓝图 — Event Receive Execute AI → BPI_EnemyAI 接口调用 → Finish Execute](/images/docs/echo-quest/ch6-enemy-ai/btt-equip-weapon.png)

### 6.3 空间智能：环境查询系统（EQS）的原理与实践

#### 6.3.1 什么是 EQS？

环境查询系统（Environment Query System，EQS）是 UE 提供的一套空间推理工具，它允许 AI 在世界中生成一组候选位置点，并通过一系列可配置的测试（Test）对这些点进行评分和排序，最终选出"最优位置"供行为树使用。

在本项目中，EQS 主要用于解决敌人的**战术走位**问题——攻击完成后，敌人需要选择一个合理的位置进行游走或重新走位，而不是呆板地站在原地等待下一次攻击。

#### 6.3.2 EQS_Strafe 的具体实现

**查询上下文 - EQS_Context_AttackTarget：**

在执行 EQS 查询前，首先需要定义查询的参考点。EQS_Context_AttackTarget 是一个自定义的 EQS Context，它从行为树的黑板中读取 `AttackTarget` 变量（即玩家），并将其世界坐标作为生成器的中心参考点。

**生成器 - Points: Circle（环形点生成）：**

EQS_Strafe 使用 Points: Circle 生成器，以 EQS_Context_AttackTarget（玩家位置）为圆心，在半径 **400** 的圆周上均匀生成 **5 个**候选位置点。这些点构成了敌人可能的走位落点。

![EQS_Strafe 查询资产 — Points: Circle（Center=AttackTarget, R=400, N=5）+ Distance Test + PathExist Test](/images/docs/echo-quest/ch6-enemy-ai/eqs-strafe-editor.png)

选择环形生成器而非网格生成器的原因是：近战敌人的战术走位本质上是围绕玩家做弧形运动，环形点天然契合这种运动模式，且只需 5 个点即可覆盖玩家周围的主要方向，查询开销极低。

**测试配置（Tests）：**

生成器产生候选点后，通过以下两个 Test 进行评分筛选：

1. **Distance Test（距离测试）**：
   - 评估每个候选点与 Querier（敌人自身）之间的距离；
   - 配置筛选范围为 **150 ~ 500**，即过近（< 150）或过远（> 500）的点会被直接剔除；
   - 这确保敌人不会走位到离玩家太近（容易被连招覆盖）或太远（脱离战斗节奏）的位置。

2. **Path Exists Test（路径可达性测试）**：
   - 从 Querier（敌人自身）到候选点执行导航路径检测；
   - 剔除所有无法通过 NavMesh 到达的点（如被墙壁、障碍物阻挡的位置）；
   - 这是一个硬性筛选条件，确保敌人不会尝试移动到物理上不可达的位置，避免 AI 卡在障碍物上。

**查询结果的使用：**

EQS 查询返回的最优位置点会被写入黑板的 `PointOfInterest` 变量。随后，行为树的 Combat State 中的 Strafe 分支会执行 Move to PointOfInterest，驱动敌人移动至该点。整个流程形成了：攻击 → EQS 查询最优走位点 → 移动至走位点 → 重新评估距离 → 再次攻击的战术循环。

![EQS 运行时调试可视化 — 5 个环形候选点评分球体（绿=高分可选、红=被剔除、蓝=最终选中）](/images/docs/echo-quest/ch6-enemy-ai/eqs-strafe-debug.png)

![PIE 运行时敌人战术走位 — EQS 驱动"攻击→走位→再攻击"循环](/images/docs/echo-quest/ch6-enemy-ai/eqs-strafe-ingame.png)

#### 6.3.3 EQS 在项目中的设计考量

**为什么不直接随机移动？**

简单的随机移动会导致两个问题：敌人可能移动到墙壁后方或不可达区域导致卡死，或者移动到离玩家极远的位置破坏战斗节奏。EQS 通过 Distance Test 和 Path Exists Test 的双重约束，确保走位点始终在合理的战斗范围内且物理可达。

**为什么只用 5 个点？**

EQS 查询存在性能开销，候选点越多，每帧的测试计算量越大。对于近战敌人的走位需求，5 个等距环形点已足够覆盖玩家周围的前、后、左、右及侧后方，在保证战术多样性的前提下将查询开销降到最低。

**后续扩展方向：**

- **Dot Product Test（方向偏好）**：加入与敌人面朝方向的点乘测试，使敌人倾向于选择侧面或背面的走位点，模拟"包抄"战术；
- **多敌人协同**：当场景中存在多个敌人时，加入 Distance to Other Queriers 测试，使不同敌人之间保持距离，避免扎堆站在同一位置，实现群体 AI 的基础分散站位。

